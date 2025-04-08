import axios from "axios";
import CryptoJS from "crypto-js";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://127.0.0.1:8000";
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || null;

// Encryption/decryption functions
const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Secure storage helpers
const secureStorage = {
    setItem: (key: string, value: string): void => {
        localStorage.setItem(key, encryptData(value));
    },

    getItem: (key: string): string | null => {
        const item = localStorage.getItem(key);
        if (!item) return null;
        try {
            return decryptData(item);
        } catch (error) {
            // If decryption fails, remove the corrupted item
            localStorage.removeItem(key);
            return null;
        }
    },

    removeItem: (key: string): void => {
        localStorage.removeItem(key);
    },
};

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
                // Get encrypted credentials and decrypt them
                const encryptedEmail = localStorage.getItem("userEmail");
                const encryptedPassword = localStorage.getItem("userPassword");

                if (!encryptedEmail || !encryptedPassword) {
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                // Decrypt credentials
                const email = secureStorage.getItem("userEmail");
                const password = secureStorage.getItem("userPassword");

                if (!email || !password) {
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                const response = await axios.post(`${API_URL}/api/token/`, {
                    username: email,
                    password: password,
                });

                if (response.data.access) {
                    localStorage.setItem("accessToken", response.data.access);

                    if (response.data.refresh) {
                        localStorage.setItem(
                            "refreshToken",
                            response.data.refresh
                        );
                    }

                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

                    // Retry the original request
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userPassword");
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

// Export secureStorage for use in other components
export { secureStorage };

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

    updateUser: (userData: {
        first_name?: string;
        last_name?: string;
        email?: string;
        password?: string;
        company_name?: string;
        company_address?: string;
        company_website?: string;
    }) => apiClient.put("/api/update-user/", userData),

    deleteAccount: () => apiClient.delete("/api/users/delete/"),

    deleteUserAsAdmin: (userId: number) =>
        apiClient.delete("/api/users/delete/", {
            data: { user_id: userId },
        }),

    registerEmployeeAdmin: (data: {
        email: string;
        password: string;
        username: string;
        first_name: string;
        last_name: string;
        role: string;
    }) => {
        return apiClient.post("/api/register/", data);
    },

    registerEmployer: (data: {
        email: string;
        password: string;
        username: string;
        first_name: string;
        last_name: string;
        role: string;
        company_name: string;
        company_address: string;
        company_website: string;
    }) => {
        return apiClient.post("/api/register/", data);
    },
};

// Post management services
export const postApi = {
    createPost: (postData: {
        title: string;
        description: string;
        final_date: string;
        salaire: number;
    }) => apiClient.post("/post/new/", postData),

    getAllPosts: () => apiClient.get("/post/getAll/"),

    getPostById: (id: number) => apiClient.get(`/post/get/${id}/`),

    updatePost: (
        id: number,
        postData: {
            title?: string;
            description?: string;
            final_date?: string;
            salaire?: number;
        }
    ) => apiClient.put(`/post/update/${id}/`, postData),

    deletePost: (id: number) => apiClient.delete(`/post/delete/${id}/`),

    reportPost: (reportData: { post_id: number; description: string }) =>
        apiClient.post("/post/report/", reportData),
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

    // Get user CVs
    getUserCVs: () => {
        return apiClient.get("/cv");
    },

    // Get specific CV
    getCV: (id: number) => {
        return apiClient.get(`/cv/${id}`);
    },

    // Delete a CV
    deleteCV: (id: number) => {
        return apiClient.delete(`/cv/${id}`);
    },

    // Get interview questions for a job
    getInterviewQuestions: (jobId: number) => {
        return apiClient.get(`/interview/job/${jobId}/questions`);
    },

    // Submit interview answers
    submitInterviewAnswers: (jobId: number, answers: any) => {
        return apiClient.post(`/interview/job/${jobId}/submit`, { answers });
    },
};

// Dashboard statistics services
export const dashboardApi = {
    getRoleBasedStats: () => apiClient.get("/api/dashboard-stats/"),
};
