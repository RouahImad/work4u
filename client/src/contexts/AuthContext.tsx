import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { authApi } from "../services/api";

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
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to login");
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

            // After registration, log the user in
            await login(data.email, data.password);

            // Set the user role
            localStorage.setItem("userRole", "employee");
            setUserRole("employee");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to register");
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

            // After registration, log the user in
            await login(data.email, data.password);

            // Set the user role
            localStorage.setItem("userRole", "employer");
            setUserRole("employer");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to register");
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
