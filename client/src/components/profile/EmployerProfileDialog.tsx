import { useState, useEffect } from "react";
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
    Alert,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../notifications/SlideInNotifications";

interface EmployerProfileDialogProps {
    open: boolean;
    onClose: () => void;
}

const EmployerProfileDialog = ({
    open,
    onClose,
}: EmployerProfileDialogProps) => {
    const { user, updateUserProfile } = useAuth();
    const { pushNotification } = useNotification();

    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        company_name: user?.company_name || "",
        company_address: user?.company_address || "",
        company_website: user?.company_website || "",
    });

    // Track the initial form data to detect changes
    const [initialFormData, setInitialFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        company_name: "",
        company_address: "",
        company_website: "",
    });

    const [errors, setErrors] = useState<{
        first_name?: string;
        last_name?: string;
        email?: string;
        company_name?: string;
        company_website?: string;
    }>({});

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Update form data when user or open state changes
    useEffect(() => {
        if (open && user) {
            const userData = {
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                company_name: user.company_name || "",
                company_address: user.company_address || "",
                company_website: user.company_website || "",
            };
            setFormData(userData);
            setInitialFormData(userData);
        }
    }, [user, open]);

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

        // Clear error message when user makes changes
        if (errorMessage) {
            setErrorMessage(null);
        }
    };

    const validateForm = () => {
        const newErrors: {
            first_name?: string;
            last_name?: string;
            email?: string;
            company_name?: string;
            company_website?: string;
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

        if (!formData.company_name.trim()) {
            newErrors.company_name = "Company name is required";
        }

        if (
            formData.company_website &&
            !formData.company_website.startsWith("http")
        ) {
            newErrors.company_website =
                "Website should include http:// or https://";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Check if form data has changed
    const hasFormChanged = () => {
        return (
            formData.first_name !== initialFormData.first_name ||
            formData.last_name !== initialFormData.last_name ||
            formData.email !== initialFormData.email ||
            formData.company_name !== initialFormData.company_name ||
            formData.company_address !== initialFormData.company_address ||
            formData.company_website !== initialFormData.company_website
        );
    };

    // Check if form data is valid
    const isFormValid = () => {
        return (
            !!formData.first_name.trim() &&
            !!formData.last_name.trim() &&
            !!formData.email &&
            /\S+@\S+\.\S+/.test(formData.email) &&
            !!formData.company_name.trim()
        );
    };

    // Determine if save button should be disabled
    const isSaveDisabled = !hasFormChanged() || !isFormValid() || isLoading;

    const handleSubmit = async () => {
        if (!validateForm() || !hasFormChanged()) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            await updateUserProfile(formData);
            pushNotification("Company profile updated successfully", "success");
            onClose();
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            setErrorMessage(
                error.response?.data?.detail || "Failed to update profile"
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle dialog close with reset
    const handleClose = () => {
        if (!isLoading) {
            // Reset form and errors on close
            setFormData(initialFormData);
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
                Edit Company Profile
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

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Company Name"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            error={!!errors.company_name}
                            helperText={errors.company_name}
                            disabled={isLoading}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Company Address"
                            name="company_address"
                            value={formData.company_address}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Company Website (include http:// or https://)"
                            name="company_website"
                            value={formData.company_website}
                            onChange={handleChange}
                            error={!!errors.company_website}
                            helperText={errors.company_website}
                            disabled={isLoading}
                            placeholder="https://example.com"
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
                    disabled={isSaveDisabled}
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

export default EmployerProfileDialog;
