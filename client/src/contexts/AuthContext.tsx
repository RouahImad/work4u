import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { authApi, secureStorage } from "../services/api";
import { useNotification } from "../components/notifications/SlideInNotifications";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    company_name?: string;
    company_address?: string;
    company_website?: string;
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
    company_address: string;
    company_website: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    userRole: string;
    loading: boolean;
    error: string | null;
    logAdmin: (email: string, password: string) => void;
    login: (email: string, password: string) => Promise<void>;
    registerEmployee: (data: EmployeeRegistrationData) => Promise<void>;
    registerEmployer: (data: EmployerRegistrationData) => Promise<void>;
    logout: () => void;
    updateUserProfile: (data: {
        first_name?: string;
        last_name?: string;
        email?: string;
    }) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
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

    const logAdmin = (email: string, password: string) => {
        setUserRole("admin");
        localStorage.setItem("userRole", "admin");
        setIsAuthenticated(true);
        setUser({
            id: 0,
            username: email,
            email,
            role: "admin",
            first_name: "Admin",
            last_name: "User",
        } as User);
        localStorage.setItem("accessToken", "adminAccessToken");
        localStorage.setItem("refreshToken", "adminRefreshToken");
        secureStorage.setItem("userEmail", email);
        secureStorage.setItem("userPassword", password);
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            const response = await authApi.login({ username: email, password });
            const { access, refresh } = response.data;

            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);

            // Store encrypted credentials for token refresh
            secureStorage.setItem("userEmail", email);
            secureStorage.setItem("userPassword", password);

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
        secureStorage.removeItem("userEmail");
        secureStorage.removeItem("userPassword");
        setUser(null);
        setIsAuthenticated(false);
        setUserRole("");

        pushNotification("You have been logged out successfully", "info");

        setTimeout(() => {
            window.location.href = "/login";
        }, 1000);
    };

    const updateUserProfile = async (data: {
        first_name?: string;
        last_name?: string;
        email?: string;
        username?: string;
    }) => {
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

    const updatePassword = async (newPassword: string) => {
        try {
            setLoading(true);
            await authApi.updateUser({
                password: newPassword,
            });

            secureStorage.setItem("userPassword", newPassword);

            pushNotification("Password updated successfully", "success");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to update password";
            setError(errorMessage);

            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!user) {
                throw new Error("User not found");
            }
            await authApi.deleteAccount();

            logout();

            if (!handlesOwnNotifications) {
                pushNotification(
                    "Your account has been deleted successfully",
                    "success"
                );
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to delete account";
            setError(errorMessage);

            if (!handlesOwnNotifications) {
                pushNotification(errorMessage, "error");
            }
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
                logAdmin,
                login,
                registerEmployee,
                registerEmployer,
                logout,
                updateUserProfile,
                updatePassword,
                deleteAccount, // Add this line
                handlesOwnNotifications,
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
