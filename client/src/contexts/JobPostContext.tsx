import { createContext, useContext, useState, ReactNode } from "react";
import { postApi } from "../services/api";
import { useNotification } from "../components/notifications/SlideInNotifications";
import { Job, JobPost } from "../types/Job.types";

interface JobPostContextType {
    jobs: Job[];
    currentJob: Job | null;
    loading: boolean;
    error: string | null;
    fetchAllJobs: () => Promise<void>;
    fetchJobById: (id: number) => Promise<void>;
    createJob: (jobData: Omit<JobPost, "id">) => Promise<void>;
    updateJob: (id: number, jobData: Partial<Job>) => Promise<void>;
    deleteJob: (id: number) => Promise<void>;
    reportJob: (reportData: {
        post_id: number;
        description: string;
    }) => Promise<void>;
}

const JobPostContext = createContext<JobPostContextType | undefined>(undefined);

export const JobPostProvider = ({ children }: { children: ReactNode }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [currentJob, setCurrentJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { pushNotification } = useNotification();

    const fetchAllJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await postApi.getAllPosts();

            // Map posts to include company information from the user object
            const formattedJobs = response.data.posts
                ? response.data.posts.map((post: any) => ({
                      id: post.id,
                      title: post.title,
                      description: post.description,
                      final_date: post.final_date,
                      salaire: post.salaire,
                      uploaded_at: post.uploaded_at,
                      accepted: post.accepted,
                      user_id: post.user?.id,
                      company_name:
                          post.user?.company_name || "Unknown Company",
                      company_address:
                          post.user?.company_address || "Unknown Location",
                      company_website: post.user?.company_website || "",
                  }))
                : [];

            setJobs(formattedJobs.reverse());
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to fetch jobs";
            setError(errorMessage);
            console.log(errorMessage);

            pushNotification(
                "Failed to load jobs. Please try again later.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchJobById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await postApi.getPostById(id);

            if (!response.data.post) {
                throw new Error("Job not found");
            }

            const post = response.data.post;

            // Create a job with company information from the user object
            const formattedJob: Job = {
                id: post.id,
                title: post.title,
                description: post.description,
                final_date: post.final_date,
                salaire: post.salaire,
                uploaded_at: post.uploaded_at,
                accepted: post.accepted,
                user_id: post.user?.id,
                // Extract company details from the user object
                company_name: post.user?.company_name || "Unknown Company",
                company_address:
                    post.user?.company_address || "Unknown Location",
                company_website: post.user?.company_website || "",
            };

            setCurrentJob(formattedJob);
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
        salaire: number;
    }) => {
        try {
            setLoading(true);
            setError(null);
            await postApi.createPost(jobData);
            pushNotification("Job posted successfully!", "success");
            await fetchAllJobs();
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail ||
                err.response?.data?.error ||
                "Failed to create job";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateJob = async (
        id: number,
        jobData: {
            title?: string;
            description?: string;
            final_date?: string;
            salaire?: number;
        }
    ) => {
        try {
            setLoading(true);
            setError(null);
            await postApi.updatePost(id, jobData);
            pushNotification("Job updated successfully!", "success");
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
