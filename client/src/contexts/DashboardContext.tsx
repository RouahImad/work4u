import { createContext, useContext, useState, ReactNode } from "react";
import { dashboardApi } from "../services/api";
import { useNotification } from "../components/notifications/SlideInNotifications";
import { logError } from "../services/errorUtils";
import {
    AdminDashboardStats,
    EmployeeDashboardStats,
    EmployerDashboardStats,
} from "../types/Stats.types";

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
            console.clear();

            setEmployeeStats(response.data);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail ||
                "Failed to fetch dashboard statistics";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            logError(err, "fetchEmployeeStats");
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
            logError(err, "fetchEmployerStats");
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
            const errorMessage =
                err.response?.data?.detail ||
                "Failed to fetch admin dashboard statistics";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            logError(err, "fetchAdminStats");
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
