import { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    Grid,
    Link as MuiLink,
    Alert,
    CircularProgress,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import the auth context
import { useNotification } from "../components/notifications/SlideInNotifications"; // Import the notification hook

const Login = () => {
    const navigate = useNavigate();
    const { login, userRole, isAuthenticated, handlesOwnNotifications } =
        useAuth(); // Get userRole and isAuthenticated
    const { pushNotification } = useNotification();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>(
        {}
    );
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Effect to redirect user if already authenticated (e.g. if they manually navigate to /login)
    useEffect(() => {
        if (isAuthenticated && userRole) {
            redirectBasedOnRole(userRole);
        }
    }, [isAuthenticated, userRole]);

    const redirectBasedOnRole = (role: string) => {
        switch (role) {
            case "admin":
                navigate("/admin/dashboard");
                break;
            case "employer":
                navigate("/employer/dashboard");
                break;
            case "employee":
            default:
                navigate("/employee/dashboard");
                break;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear errors when typing
        if (errors[name as keyof typeof errors]) {
            setErrors({
                ...errors,
                [name]: undefined,
            });
        }
    };

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setLoginError("");

        try {
            // Call login from auth context
            await login(formData.email, formData.password);

            // Get the user role from the context after login
            const role = localStorage.getItem("userRole") || "employee";

            // Only show notification if auth context doesn't handle it
            if (!handlesOwnNotifications) {
                const roleDisplay =
                    role.charAt(0).toUpperCase() + role.slice(1);
                pushNotification(
                    `Successfully logged in as ${roleDisplay}! Redirecting...`,
                    "success"
                );
            }

            // Redirect based on role - add a slight delay to show the notification
            setTimeout(() => {
                redirectBasedOnRole(role);
            }, 1000);
        } catch (error: any) {
            if (!handlesOwnNotifications) {
                const errorMessage =
                    error.response?.data?.detail || "Invalid email or password";
                pushNotification(errorMessage, "error");
            }
            setLoginError(
                error.response?.data?.detail || "Invalid email or password"
            );
            console.error("Login error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={3}
                sx={{
                    mt: 8,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 2,
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5" mb={3}>
                    Sign In
                </Typography>

                {loginError && (
                    <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                        {loginError}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1, width: "100%" }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={isLoading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Sign In"}
                    </Button>
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <MuiLink component="button" variant="body2">
                                Forgot password?
                            </MuiLink>
                        </Grid>
                        <Grid item>
                            <MuiLink
                                component={Link}
                                to="/register"
                                variant="body2"
                            >
                                {"Don't have an account? Sign Up"}
                            </MuiLink>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
