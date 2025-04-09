import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { authApi, secureStorage } from "../services/api";
import { useNotification } from "../components/notifications/SlideInNotifications";
import { sanitizeErrorMessage, logError } from "../services/errorUtils";
import {
    User,
    EmployeeRegistrationData,
    EmployerRegistrationData,
    CreateUserData,
} from "../types/User.types";

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
    updateUserProfile: (data: {
        first_name?: string;
        last_name?: string;
        email?: string;
    }) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
    handlesOwnNotifications: boolean;
    createUser: (userData: CreateUserData) => Promise<boolean>;
    deleteUser: (userId: number) => Promise<void>;
    verifyUser: (userId: number) => Promise<void>;
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
            const errorMessage = sanitizeErrorMessage(err, "Failed to login");
            setError(errorMessage);

            // Show error notification
            pushNotification(errorMessage, "error");
            logError(err, "login");
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
            const errorMessage = sanitizeErrorMessage(
                err,
                "Failed to register employee"
            );
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
            const errorMessage = sanitizeErrorMessage(
                err,
                "Failed to register employer"
            );
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
            const errorMessage = sanitizeErrorMessage(
                err,
                "Failed to update user profile"
            );
            setError(errorMessage);
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
            const errorMessage = sanitizeErrorMessage(
                err,
                "Failed to update password"
            );
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
            const errorMessage = sanitizeErrorMessage(
                err,
                "Failed to delete account"
            );
            setError(errorMessage);

            if (!handlesOwnNotifications) {
                pushNotification(errorMessage, "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData: CreateUserData) => {
        try {
            setLoading(true);
            setError(null);

            userData.role === "employer"
                ? await authApi.registerEmployer({
                      ...userData,
                      company_name: userData.company_name || "uknown",
                      company_address: userData.company_address || "uknown",
                      company_website: userData.company_website || "uknown",
                  })
                : await authApi.registerEmployeeAdmin(userData);

            pushNotification(
                `User ${userData.username} created successfully.`,
                "success"
            );

            setLoading(false);
            return true;
        } catch (err: any) {
            const errorMessage = sanitizeErrorMessage(
                err,
                "Failed to create user"
            );
            setError(`${errorMessage} from here`);
            pushNotification(errorMessage, "error");
            setLoading(false);
            return false;
        }
    };

    const deleteUser = async (userId: number): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            await authApi.deleteUserAsAdmin(userId);

            pushNotification(`User deleted successfully.`, "success");
        } catch (err: any) {
            const errorMessage = sanitizeErrorMessage(
                err,
                "Failed to delete user"
            );
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const verifyUser = async (userId: number): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await authApi.verifyUser(userId);

            // Update the local users array if the verified user is the current user
            if (user && user.id === userId) {
                setUser({
                    ...user,
                    verified: true,
                });
            }

            pushNotification(`User verified successfully.`, "success");

            return response.data.user;
        } catch (err: any) {
            const errorMessage = sanitizeErrorMessage(
                err,
                "Failed to verify user"
            );
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            throw new Error(errorMessage);
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
                updatePassword,
                deleteAccount,
                handlesOwnNotifications,
                createUser,
                deleteUser,
                verifyUser,
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
