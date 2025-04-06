import { createContext, useContext, useState, ReactNode } from "react";
import { postApi } from "../services/api";
import { useNotification } from "../components/notifications/SlideInNotifications";

// Define the job post interface
interface JobPost {
    id: number;
    title: string;
    description: string;
    final_date: string;
    created_at?: string;
    employer_id?: number;
}

interface JobPostContextType {
    jobs: JobPost[];
    currentJob: JobPost | null;
    loading: boolean;
    error: string | null;
    fetchAllJobs: () => Promise<void>;
    fetchJobById: (id: number) => Promise<void>;
    createJob: (jobData: Omit<JobPost, "id">) => Promise<void>;
    updateJob: (id: number, jobData: Partial<JobPost>) => Promise<void>;
    deleteJob: (id: number) => Promise<void>;
    reportJob: (reportData: {
        post_id: number;
        description: string;
    }) => Promise<void>;
}

const JobPostContext = createContext<JobPostContextType | undefined>(undefined);

export const JobPostProvider = ({ children }: { children: ReactNode }) => {
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [currentJob, setCurrentJob] = useState<JobPost | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { pushNotification } = useNotification();

    const fetchAllJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await postApi.getAllPosts();
            setJobs(response.data);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to fetch jobs";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchJobById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await postApi.getPostById(id);
            setCurrentJob(response.data);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to fetch job details";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    const createJob = async (jobData: {
        title: string;
        description: string;
        final_date: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            await postApi.createPost(jobData);
            pushNotification("Job posted successfully!", "success");
            // Refresh the jobs list
            await fetchAllJobs();
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to create job";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateJob = async (
        id: number,
        jobData: { title?: string; description?: string; final_date?: string }
    ) => {
        try {
            setLoading(true);
            setError(null);
            await postApi.updatePost(id, jobData);
            pushNotification("Job updated successfully!", "success");
            // Refresh current job data
            await fetchJobById(id);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to update job";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteJob = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await postApi.deletePost(id);
            pushNotification("Job deleted successfully!", "success");
            // Refresh the jobs list
            await fetchAllJobs();
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to delete job";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reportJob = async (reportData: {
        post_id: number;
        description: string;
    }) => {
        try {
            setLoading(true);
            setError(null);

            await postApi.reportPost(reportData);

            pushNotification(
                "Your report has been submitted successfully.",
                "success"
            );
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to report job";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <JobPostContext.Provider
            value={{
                jobs,
                currentJob,
                loading,
                error,
                fetchAllJobs,
                fetchJobById,
                createJob,
                updateJob,
                deleteJob,
                reportJob,
            }}
        >
            {children}
        </JobPostContext.Provider>
    );
};

export const useJobPost = () => {
    const context = useContext(JobPostContext);
    if (context === undefined) {
        throw new Error("useJobPost must be used within a JobPostProvider");
    }
    return context;
};
