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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../notifications/SlideInNotifications";

interface EditProfileDialogProps {
    open: boolean;
    onClose: () => void;
}

const EditProfileDialog = ({ open, onClose }: EditProfileDialogProps) => {
    const { user, updateUserProfile } = useAuth();
    const { pushNotification } = useNotification();

    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
    });

    const [errors, setErrors] = useState<{
        first_name?: string;
        last_name?: string;
        email?: string;
    }>({});

    const [isLoading, setIsLoading] = useState(false);

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
            first_name?: string;
            last_name?: string;
            email?: string;
        } = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = "First name is required";
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = "Last name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await updateUserProfile(formData);
            pushNotification("Profile updated successfully", "success");
            onClose();
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            pushNotification(
                error.response?.data?.detail || "Failed to update profile",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={!isLoading ? onClose : undefined}
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
                Edit Profile Information
                {!isLoading && (
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            error={!!errors.first_name}
                            helperText={errors.first_name}
                            disabled={isLoading}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            error={!!errors.last_name}
                            helperText={errors.last_name}
                            disabled={isLoading}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={isLoading}
                            required
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
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
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileDialog;
