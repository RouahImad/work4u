import axios from "axios";

// You can adjust this URL based on your environment configuration
const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
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
