import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import { Theme } from "@mui/material";
// Import other pages
import EmployeeDashboard from "./dashboards/EmployeeDashboard"; // Create this component
import EmployerDashboard from "./dashboards/EmployerDashboard"; // Create this component
import AdminDashboard from "./dashboards/AdminDashboard"; // Create this component
import JobsFeed from "./JobsFeed"; // Create this component
import Login from "./Login"; // Create this component
import Register from "./Register"; // Create this component

// Protected route wrapper component
const ProtectedRoute = ({
    isAuthenticated,
    userRole,
    allowedRoles,
    children,
}: {
    isAuthenticated: boolean;
    userRole: string;
    allowedRoles?: string[];
    children: React.ReactNode;
}) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const AppRoutes = ({
    theme,
    darkMode,
    setDarkMode,
    isAuthenticated,
    userRole,
}: {
    theme: Theme;
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
    isAuthenticated: boolean;
    userRole: string;
}) => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
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
                <Route path="/register" element={<Register />} />

                {/* Role-specific dashboard routes */}
                <Route
                    path="/employee/dashboard"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            userRole={userRole}
                            allowedRoles={["employee"]}
                        >
                            <EmployeeDashboard
                                theme={theme}
                                // darkMode={darkMode}
                            />
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
                        >
                            <EmployerDashboard
                                theme={theme}
                                // darkMode={darkMode}
                            />
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
                        >
                            <AdminDashboard
                            // theme={theme}
                            //  darkMode={darkMode}
                            />
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
                        >
                            <JobsFeed theme={theme} />
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
