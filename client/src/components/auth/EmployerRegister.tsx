import { useState } from "react";
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
import { BusinessCenter, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../components/notifications/SlideInNotifications";

const EmployerRegister = () => {
    const navigate = useNavigate();
    const { registerEmployer, handlesOwnNotifications } = useAuth();
    const { pushNotification } = useNotification();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        companyAddress: "",
        companyWebsite: "",
    });

    // Add password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        companyName?: string;
        companyAddress?: string;
        companyWebsite?: string;
    }>({});

    const [registerError, setRegisterError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Add toggle handlers for password visibility
    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(
            (prevShowConfirmPassword) => !prevShowConfirmPassword
        );
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
        const newErrors: {
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
            companyName?: string;
            companyAddress?: string;
            companyWebsite?: string;
        } = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }

        // Website format validation (optional field)
        if (
            formData.companyWebsite &&
            !formData.companyWebsite.startsWith("http")
        ) {
            newErrors.companyWebsite =
                "Website should include http:// or https://";
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
        setRegisterError("");

        try {
            // Register as employer
            await registerEmployer({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: "employer",
                company_name: formData.companyName,
                company_address: formData.companyAddress,
                company_website: formData.companyWebsite,
            });

            // Only show notification if auth context doesn't handle it
            if (!handlesOwnNotifications) {
                pushNotification(
                    "Employer account created successfully! Redirecting to dashboard...",
                    "success"
                );
            }

            // Redirect to employer dashboard after a short delay to show the notification
            setTimeout(() => {
                navigate("/employer/dashboard");
            }, 1500);
        } catch (error: any) {
            // Handle error responses from the API
            let errorMessage = "Registration failed. Please try again.";

            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
                setRegisterError(errorMessage);
            } else if (error.response?.data) {
                // Handle validation errors
                const fieldErrors = error.response.data;
                errorMessage = Object.entries(fieldErrors)
                    .map(([field, messages]) => `${field}: ${messages}`)
                    .join(", ");
                setRegisterError(errorMessage);
            } else {
                setRegisterError(errorMessage);
            }

            // Only show notification if auth context doesn't handle it
            if (!handlesOwnNotifications) {
                pushNotification(errorMessage, "error");
            }

            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
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
                    <BusinessCenter />
                </Avatar>
                <Typography component="h1" variant="h5" mb={3}>
                    Create Employer Account
                </Typography>

                {registerError && (
                    <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                        {registerError}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ mt: 3, width: "100%" }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={formData.firstName}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="new-password"
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={
                                                    handleToggleConfirmPasswordVisibility
                                                }
                                                edge="end"
                                                disabled={isLoading}
                                                size="large"
                                                sx={{ color: "text.secondary" }}
                                            >
                                                {showConfirmPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                Company Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="companyName"
                                label="Company Name"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                error={!!errors.companyName}
                                helperText={errors.companyName}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="companyAddress"
                                label="Company Address"
                                name="companyAddress"
                                value={formData.companyAddress}
                                onChange={handleChange}
                                error={!!errors.companyAddress}
                                helperText={errors.companyAddress}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="companyWebsite"
                                label="Company Website (with https://)"
                                name="companyWebsite"
                                value={formData.companyWebsite}
                                onChange={handleChange}
                                error={!!errors.companyWebsite}
                                helperText={errors.companyWebsite}
                                disabled={isLoading}
                                placeholder="https://example.com"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Create Employer Account"
                        )}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <MuiLink
                                component={Link}
                                to="/register/employee"
                                variant="body2"
                            >
                                Register as a Job Seeker
                            </MuiLink>
                        </Grid>
                        <Grid item>
                            <MuiLink
                                component={Link}
                                to="/login"
                                variant="body2"
                            >
                                Already have an account? Sign in
                            </MuiLink>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default EmployerRegister;
