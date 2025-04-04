import axios from "axios";

// You can adjust this URL based on your environment configuration
const API_URL = import.meta.env.VITE_APP_API_URL || "http://127.0.0.1:8000";

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true, // This is important for sending cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors (unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip token refresh logic if the user is attempting to login
        // We don't want to redirect back to login if they're already there
        const isLoginAttempt =
            originalRequest.url === "/api/token/" &&
            originalRequest.method === "post";

        // If the error is 401 and we haven't already tried to refresh the token
        // and it's not a login attempt
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isLoginAttempt
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    // No refresh token available, redirect to login

                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                // Try to get a new access token
                const response = await axios.post(
                    `${API_URL}/api/token/refresh/`,
                    {
                        refresh: refreshToken,
                    }
                );

                if (response.data.access) {
                    // Store the new access token
                    localStorage.setItem("accessToken", response.data.access);

                    // Update the Authorization header
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

                    // Retry the original request
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // If refreshing token fails, redirect to login
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userRole");

                if (!window.location.pathname.includes("/login")) {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth services
export const authApi = {
    register: (userData: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        role: string;
        company_name?: string;
        company_address?: string;
        company_website?: string;
    }) => apiClient.post("/api/register/", userData),

    login: (credentials: { username: string; password: string }) =>
        apiClient.post("/api/token/", credentials),

    getCurrentUser: () => apiClient.get("/api/current-user/"),

    updateUser: (userData: { email?: string }) =>
        apiClient.put("/api/update-user/", userData),
};

// Post management services
export const postApi = {
    createPost: (postData: {
        title: string;
        description: string;
        final_date: string;
    }) => apiClient.post("/post/new/", postData),

    getAllPosts: () => apiClient.get("/post/getAll/"),

    getPostById: (id: number) => apiClient.get(`/post/get/${id}/`),

    updatePost: (
        id: number,
        postData: { title?: string; description?: string; final_date?: string }
    ) => apiClient.put(`/post/update/${id}/`, postData),

    deletePost: (id: number) => apiClient.delete(`/post/delete/${id}/`),
};

// CV and interview services
export const cvInterviewApi = {
    uploadCV: (title: string, pdfFile: File) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("pdf_file", pdfFile);

        return apiClient.post("/post/upload/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    compareCvWithPost: (cvId: number, postId: number) =>
        apiClient.post("/post/compare-cv-with-post/", {
            cv_id: cvId,
            post_id: postId,
        }),

    generateInterviewQuestions: (postId: number) =>
        apiClient.post("/post/interview/", { post_id: postId }),

    submitInterviewResponses: (
        postId: number,
        responses: Array<{ question: string; answer: string }>
    ) =>
        apiClient.post("/post/submit-interview/", {
            post_id: postId,
            responses,
        }),

    evaluateResponses: (postId: number, candidateAnswers: string[]) =>
        apiClient.post("/post/evaluate-responses/", {
            post_id: postId,
            candidate_answers: candidateAnswers,
        }),
};
