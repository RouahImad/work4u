import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Grid,
} from "@mui/material";
import { useJobPost } from "../../contexts/JobPostContext";
import { useNotification } from "../notifications/SlideInNotifications";

interface CreateJobDialogProps {
    open: boolean;
    onClose: () => void;
}

const CreateJobDialog: React.FC<CreateJobDialogProps> = ({ open, onClose }) => {
    const { createJob, loading, error } = useJobPost();
    const { pushNotification } = useNotification();

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        final_date: "",
        salaire: "",
    });

    // Form validation
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
        final_date?: string;
        salaire?: string;
    }>({});

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open) {
            // Set default date to 30 days from now
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 30);

            setFormData({
                title: "",
                description: "",
                final_date: defaultDate.toISOString().split("T")[0],
                salaire: "",
            });
            setErrors({});
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error for this field when user types
        if (errors[name as keyof typeof errors]) {
            setErrors({
                ...errors,
                [name]: undefined,
            });
        }
    };

    const validateForm = () => {
        const newErrors: {
            title?: string;
            description?: string;
            final_date?: string;
            salaire?: string;
        } = {};

        if (!formData.title.trim()) {
            newErrors.title = "Job title is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Job description is required";
        } else if (formData.description.trim().length < 400) {
            newErrors.description =
                "Description should be at least 400 characters long";
        }

        if (!formData.final_date) {
            newErrors.final_date = "Application deadline is required";
        } else {
            const selectedDate = new Date(formData.final_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.final_date = "Deadline must be in the future";
            }
        }

        if (!formData.salaire) {
            newErrors.salaire = "Salary is required";
        } else if (Number(formData.salaire) <= 0) {
            newErrors.salaire = "Salary must be greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            await createJob({
                title: formData.title,
                description: formData.description,
                final_date: formData.final_date,
                salaire: Number(formData.salaire),
            });

            onClose();
        } catch (error) {
            console.error("Failed to create job:", error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={!loading ? onClose : undefined}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Create New Job</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            name="title"
                            label="Job Title"
                            fullWidth
                            value={formData.title}
                            onChange={handleChange}
                            error={!!errors.title}
                            helperText={errors.title}
                            disabled={loading}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            name="description"
                            label="Job Description"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            error={!!errors.description}
                            helperText={errors.description}
                            disabled={loading}
                            required
                            placeholder="Provide a detailed description of the job responsibilities, requirements, and benefits..."
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            name="final_date"
                            label="Application Deadline"
                            type="date"
                            fullWidth
                            value={formData.final_date}
                            onChange={handleChange}
                            error={!!errors.final_date}
                            helperText={errors.final_date}
                            disabled={loading}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            name="salaire"
                            label="Salary"
                            type="number"
                            fullWidth
                            value={formData.salaire}
                            onChange={handleChange}
                            error={!!errors.salaire}
                            helperText={errors.salaire}
                            disabled={loading}
                            required
                            InputProps={{ startAdornment: "$" }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={
                        loading ||
                        (!formData.title &&
                            !formData.description &&
                            !formData.final_date &&
                            !formData.salaire)
                    }
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? "Creating..." : "Create Job"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateJobDialog;
