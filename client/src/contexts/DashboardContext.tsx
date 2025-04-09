import { createContext, useContext, useState, ReactNode } from "react";
import { dashboardApi } from "../services/api";
import { useNotification } from "../components/notifications/SlideInNotifications";
import { UserBase } from "../types/User.types";

// Define interfaces for the API response
interface InterviewHistory {
    id: number;
    post_title: string;
    question: string;
    answer: string;
    score: number;
    response_date: string;
}

interface Application {
    post_title: string;
    cv_id: number;
    interview_id: number;
    status: string;
    application_date: string;
}

interface EmployerPost {
    id: number;
    title: string;
    salaire: string;
    uploaded_at: string;
}

interface EmployerApplication {
    id: number;
    post_title: string;
    applicant_email: string;
    cv_id: number;
    interview_id: number;
    application_date: string;
    status: string;
}

interface EmployeeDashboardStats {
    interview_history: InterviewHistory[];
    total_responses: number;
    average_score: number;
    applications: Application[];
}

interface EmployerDashboardStats {
    my_posts: EmployerPost[];
    total_posts: number;
    applications: EmployerApplication[];
    total_applications: number;
    pending_applications: number;
}

interface ReportDetail {
    id: number;
    post_title: string;
    user_email: string;
    description: string;
    reported_at: string;
}

interface AdminDashboardStats {
    users: {
        total: number;
        list: UserBase[];
    };
    posts: {
        total: number;
        average_salaire: number;
    };
    cvs: {
        total: number;
    };
    interview_responses: {
        total: number;
        average_score: number;
    };
    applications: {
        total: number;
        pending: number;
        accepted: number;
    };
    reports: {
        total: number;
        details: ReportDetail[];
    };
}

interface DashboardContextType {
    employeeStats: EmployeeDashboardStats | null;
    employerStats: EmployerDashboardStats | null;
    adminStats: AdminDashboardStats | null;
    loading: boolean;
    error: string | null;
    fetchEmployeeStats: () => Promise<void>;
    fetchEmployerStats: () => Promise<void>;
    fetchAdminStats: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
    undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [employeeStats, setEmployeeStats] =
        useState<EmployeeDashboardStats | null>(null);
    const [employerStats, setEmployerStats] =
        useState<EmployerDashboardStats | null>(null);
    const [adminStats, setAdminStats] = useState<AdminDashboardStats | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { pushNotification } = useNotification();

    const fetchEmployeeStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await dashboardApi.getRoleBasedStats();

            setEmployeeStats(response.data);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail ||
                "Failed to fetch dashboard statistics";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployerStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await dashboardApi.getRoleBasedStats();
            setEmployerStats(response.data);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail ||
                "Failed to fetch dashboard statistics";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await dashboardApi.getRoleBasedStats();
            setAdminStats(response.data);
        } catch (err: any) {
            console.log(err);

            const errorMessage =
                err.response?.data?.detail ||
                "Failed to fetch admin dashboard statistics";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardContext.Provider
            value={{
                employeeStats,
                employerStats,
                adminStats,
                loading,
                error,
                fetchEmployeeStats,
                fetchEmployerStats,
                fetchAdminStats,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
};
