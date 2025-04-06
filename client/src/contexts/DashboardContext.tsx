import { createContext, useContext, useState, ReactNode } from "react";
import { dashboardApi } from "../services/api";
import { useNotification } from "../components/notifications/SlideInNotifications";

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

interface EmployeeDashboardStats {
    interview_history: InterviewHistory[];
    total_responses: number;
    average_score: number;
    applications: Application[];
}

interface DashboardContextType {
    employeeStats: EmployeeDashboardStats | null;
    loading: boolean;
    error: string | null;
    fetchEmployeeStats: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
    undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [employeeStats, setEmployeeStats] =
        useState<EmployeeDashboardStats | null>(null);
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

    return (
        <DashboardContext.Provider
            value={{
                employeeStats,
                loading,
                error,
                fetchEmployeeStats,
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
