import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    CircularProgress,
    IconButton,
    InputAdornment,
    Alert,
} from "@mui/material";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../notifications/SlideInNotifications";
import { secureStorage } from "../../services/api"; // Import secureStorage

interface ChangePasswordDialogProps {
    open: boolean;
    onClose: () => void;
}

const ChangePasswordDialog = ({ open, onClose }: ChangePasswordDialogProps) => {
    if (!open) return null;
    const { updatePassword } = useAuth();
    const { pushNotification } = useNotification();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
        switch (field) {
            case "current":
                setShowCurrentPassword(!showCurrentPassword);
                break;
            case "new":
                setShowNewPassword(!showNewPassword);
                break;
            case "confirm":
                setShowConfirmPassword(!showConfirmPassword);
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

        // Clear general error message
        if (errorMessage) {
            setErrorMessage(null);
        }
    };

    const validateForm = () => {
        const newErrors: {
            currentPassword?: string;
            newPassword?: string;
            confirmPassword?: string;
        } = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            // Verify current password against stored password
            const storedPassword = secureStorage.getItem("userPassword");

            if (!storedPassword) {
                setErrorMessage(
                    "Cannot verify current password. Please log in again."
                );
                setIsLoading(false);
                return;
            }

            // Check if entered current password matches stored password
            if (formData.currentPassword !== storedPassword) {
                setErrors({
                    ...errors,
                    currentPassword: "Current password is incorrect",
                });
                setIsLoading(false);
                return;
            }

            await updatePassword(formData.newPassword);

            pushNotification("Password changed successfully", "success");

            // Reset form
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            onClose();
        } catch (error: any) {
            console.error("Failed to change password:", error);
            setErrorMessage(
                error.response?.data?.detail ||
                    "Failed to change password. Please check your current password."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle dialog close with reset
    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setErrors({});
            setErrorMessage(null);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={!isLoading ? handleClose : undefined}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                Change Password
                {!isLoading && (
                    <IconButton onClick={handleClose} size="small">
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent>
                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Current Password"
                            name="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={handleChange}
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword}
                            disabled={isLoading}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                togglePasswordVisibility(
                                                    "current"
                                                )
                                            }
                                            edge="end"
                                            size="large"
                                        >
                                            {showCurrentPassword ? (
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
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={handleChange}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword}
                            disabled={isLoading}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                togglePasswordVisibility("new")
                                            }
                                            edge="end"
                                            size="large"
                                        >
                                            {showNewPassword ? (
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
                            fullWidth
                            label="Confirm New Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            disabled={isLoading}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                togglePasswordVisibility(
                                                    "confirm"
                                                )
                                            }
                                            edge="end"
                                            size="large"
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
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    startIcon={
                        isLoading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : null
                    }
                >
                    {isLoading ? "Changing..." : "Change Password"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePasswordDialog;
