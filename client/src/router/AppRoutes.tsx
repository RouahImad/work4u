import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/Home";
import { Theme } from "@mui/material";
import NavBar from "../components/NavBar";
import Login from "../components/auth/Login";
import EmployeeRegister from "../components/auth/EmployeeRegister";
import EmployerRegister from "../components/auth/EmployerRegister";
import { useAuth } from "../contexts/AuthContext";
import { lazy, Suspense } from "react";
import LoadingAnimation from "../components/LoadingAnimation";

// Lazy load these components since they don't need to be loaded immediately
const EmployeeDashboard = lazy(
    () => import("../components/dashboards/EmployeeDashboard")
);
const EmployerDashboard = lazy(
    () => import("../components/dashboards/EmployerDashboard")
);
const AdminDashboard = lazy(
    () => import("../components/dashboards/AdminDashboard")
);
const JobsFeed = lazy(() => import("../components/jobs/JobsFeed"));

// Protected route wrapper component
const ProtectedRoute = ({
    isAuthenticated,
    userRole,
    allowedRoles,
    children,
    theme,
    darkMode,
    setDarkMode,
}: {
    isAuthenticated: boolean;
    userRole: string;
    allowedRoles: string[];
    children: React.ReactNode;
    theme: Theme;
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <NavBar
                userRole={userRole}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                theme={theme}
            />
            <Suspense fallback={<LoadingAnimation />}>{children}</Suspense>
        </>
    );
};

const AppRoutes = ({
    theme,
    darkMode,
    setDarkMode,
}: {
    theme: Theme;
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}) => {
    const { userRole, isAuthenticated } = useAuth();
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes - no loading animation */}
                <Route
                    path="/"
                    element={
                        <Home
                            theme={theme}
                            darkMode={darkMode}
                            setDarkMode={setDarkMode}
                        />
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/employee/register"
                    element={<Navigate to="/register/employee" replace />}
                />
                <Route
                    path="/employer/register"
                    element={<Navigate to="/register/employer" replace />}
                />
                <Route
                    path="/register"
                    element={<Navigate to="/register/employee" replace />}
                />
                <Route
                    path="/register/employee"
                    element={<EmployeeRegister />}
                />
                <Route
                    path="/register/employer"
                    element={<EmployerRegister />}
                />

                {/* Role-specific dashboard routes with loading animation */}
                <Route
                    path="/employee/dashboard"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            userRole={userRole}
                            allowedRoles={["employee"]}
                            theme={theme}
                            darkMode={darkMode}
                            setDarkMode={setDarkMode}
                        >
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employer/dashboard"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            userRole={userRole}
                            allowedRoles={["employer"]}
                            theme={theme}
                            darkMode={darkMode}
                            setDarkMode={setDarkMode}
                        >
                            <EmployerDashboard theme={theme} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            userRole={userRole}
                            allowedRoles={["admin"]}
                            theme={theme}
                            darkMode={darkMode}
                            setDarkMode={setDarkMode}
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Jobs feed - accessible to employees and admin */}
                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            userRole={userRole}
                            allowedRoles={["employee", "admin"]}
                            theme={theme}
                            darkMode={darkMode}
                            setDarkMode={setDarkMode}
                        >
                            <JobsFeed darkmode={darkMode} theme={theme} />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect any unknown paths to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
