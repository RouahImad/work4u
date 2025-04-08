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
    InputAdornment,
    IconButton,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Import the auth context
import { useNotification } from "../notifications/SlideInNotifications"; // Import the notification hook

const Login = () => {
    const navigate = useNavigate();
    const {
        login,
        userRole,
        isAuthenticated,
        handlesOwnNotifications,
        loading: authLoading,
    } = useAuth();
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
    const [showPassword, setShowPassword] = useState(false);

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

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    // Display a loading animation while we check auth status
    if (!isLoading && authLoading) {
        return (
            <Container
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Checking authentication status...
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Redirect automatically if authenticated (this happens in the useEffect)
    // Only render the login form if not authenticated
    if (!isAuthenticated) {
        return (
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    minHeight: "100vh",
                    placeContent: "center",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
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
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={isLoading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={
                                                handleTogglePasswordVisibility
                                            }
                                            edge="end"
                                            disabled={isLoading}
                                            size="large"
                                            sx={{ color: "text.secondary" }}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                        <Grid container>
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
    }

    return (
        <Container
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <Box sx={{ textAlign: "center" }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    You're already logged in. Redirecting...
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
