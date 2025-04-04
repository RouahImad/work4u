import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { authApi } from "../services/api";
import { useNotification } from "../components/notifications/SlideInNotifications";

interface User {
    id: number;
    username: string;
    email: string;
    role?: string;
}

// Define interfaces for registration
interface BaseRegistrationData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
}

interface EmployeeRegistrationData extends BaseRegistrationData {
    role: "employee";
}

interface EmployerRegistrationData extends BaseRegistrationData {
    role: "employer";
    company_name: string;
    company_address?: string;
    company_website?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    userRole: string;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    registerEmployee: (data: EmployeeRegistrationData) => Promise<void>;
    registerEmployer: (data: EmployerRegistrationData) => Promise<void>;
    logout: () => void;
    updateUserProfile: (data: { email?: string }) => Promise<void>;
    // Flag to indicate components should not show their own notifications
    handlesOwnNotifications: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        !!localStorage.getItem("accessToken")
    );
    const [userRole, setUserRole] = useState<string>(
        localStorage.getItem("userRole") || ""
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { pushNotification } = useNotification();

    // This flag indicates that auth actions handle their own notifications
    const handlesOwnNotifications = true;

    useEffect(() => {
        const fetchUser = async () => {
            if (!localStorage.getItem("accessToken")) {
                setLoading(false);
                return;
            }

            try {
                const response = await authApi.getCurrentUser();
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (err) {
                console.error("Failed to fetch user data", err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            // Use email as username as per API endpoint requirement
            const response = await authApi.login({ username: email, password });
            const { access, refresh } = response.data;

            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);

            // Fetch user data
            const userResponse = await authApi.getCurrentUser();
            setUser(userResponse.data);

            // Store user role from response if available
            const userRole = userResponse.data.role || "employee";
            localStorage.setItem("userRole", userRole);
            setUserRole(userRole);

            setIsAuthenticated(true);

            // Show success notification
            pushNotification("Successfully logged in!", "success");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to login";
            setError(errorMessage);

            // Show error notification
            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const registerEmployee = async (data: EmployeeRegistrationData) => {
        try {
            setError(null);
            setLoading(true);

            await authApi.register(data);

            // Show success notification
            pushNotification(
                "Employee account created successfully!",
                "success"
            );

            // After registration, log the user in
            await login(data.email, data.password);

            // Set the user role
            localStorage.setItem("userRole", "employee");
            setUserRole("employee");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to register";
            setError(errorMessage);

            // Show error notification
            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const registerEmployer = async (data: EmployerRegistrationData) => {
        try {
            setError(null);
            setLoading(true);

            await authApi.register(data);

            // Show success notification
            pushNotification(
                "Employer account created successfully!",
                "success"
            );

            // After registration, log the user in
            await login(data.email, data.password);

            // Set the user role
            localStorage.setItem("userRole", "employer");
            setUserRole("employer");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to register";
            setError(errorMessage);

            // Show error notification
            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        setUser(null);
        setIsAuthenticated(false);
        setUserRole("");

        // Show logout notification
        pushNotification("You have been logged out successfully", "info");
    };

    const updateUserProfile = async (data: { email?: string }) => {
        try {
            setLoading(true);
            const response = await authApi.updateUser(data);
            setUser(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to update profile");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                userRole,
                loading,
                error,
                login,
                registerEmployee,
                registerEmployer,
                logout,
                updateUserProfile,
                handlesOwnNotifications, // Add this to the context
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
