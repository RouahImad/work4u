import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import { Theme } from "@mui/material";
import NavBar from "./NavBar";
// Import other pages
import EmployeeDashboard from "./dashboards/EmployeeDashboard";
import EmployerDashboard from "./dashboards/EmployerDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import JobsFeed from "./JobsFeed";
import Login from "./Login";
import Register from "./Register";

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
    allowedRoles?: string[];
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
            {children}
        </>
    );
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
                <Route path="/employee/register" element={<Register />} />
                <Route path="/employer/register" element={<Register />} />

                {/* Role-specific dashboard routes */}
                <Route
                    path="/employee/dashboard"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            userRole={userRole}
                            allowedRoles={["employee", "admin"]}
                            theme={theme}
                            darkMode={darkMode}
                            setDarkMode={setDarkMode}
                        >
                            <EmployeeDashboard theme={theme} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employer/dashboard"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            userRole={userRole}
                            allowedRoles={["employer", "admin"]}
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
