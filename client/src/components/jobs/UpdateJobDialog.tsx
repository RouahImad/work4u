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
    Box,
} from "@mui/material";
import { useJobPost } from "../../contexts/JobPostContext";
import { JobPost } from "../../types/Job.types";
import { useDashboard } from "../../contexts/DashboardContext";

interface UpdateJobDialogProps {
    open: boolean;
    onClose: () => void;
    jobId: number | null;
    job: JobPost | null;
    viewInAdmin?: boolean | false;
}

const UpdateJobDialog: React.FC<UpdateJobDialogProps> = ({
    open,
    onClose,
    jobId,
    job,
    viewInAdmin = false,
}) => {
    const { updateJob, loading, error, fetchAllJobs } = useJobPost();
    const { fetchEmployerStats } = useDashboard();

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

    // Set form data when job data is available or changes
    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || "",
                description: job.description || "",
                final_date: job.final_date
                    ? new Date(job.final_date).toISOString().split("T")[0]
                    : "",
                salaire: job.salaire?.toString() || "",
            });
        }
    }, [job]);

    // Reset errors when dialog opens/closes
    useEffect(() => {
        if (open) {
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
        } else if (formData.description.trim().length < 50) {
            newErrors.description =
                "Description should be at least 50 characters long";
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
        if (!validateForm() || !jobId) {
            return;
        }

        try {
            await updateJob(jobId, {
                title: formData.title,
                description: formData.description,
                final_date: formData.final_date,
                salaire: Number(formData.salaire),
            });

            if (viewInAdmin) fetchAllJobs();
            else fetchEmployerStats();
            onClose();
        } catch (error) {
            console.error("Failed to update job:", error);
            // Error handling is done in the context
        }
    };

    // Check if form data has changed from the original job
    const hasChanges = () => {
        if (!job) return false;

        return (
            formData.title !== job.title ||
            formData.description !== job.description ||
            formData.final_date !==
                (job.final_date
                    ? new Date(job.final_date).toISOString().split("T")[0]
                    : "") ||
            formData.salaire !== job.salaire?.toString()
        );
    };

    return (
        <Dialog
            open={open}
            onClose={!loading ? onClose : undefined}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Update Job</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {!job ? (
                    <Box
                        sx={{ display: "flex", justifyContent: "center", p: 4 }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
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
                )}
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
                        !job ||
                        !formData.title ||
                        !formData.description ||
                        !formData.final_date ||
                        !formData.salaire ||
                        !hasChanges()
                    }
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? "Updating..." : "Update Job"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateJobDialog;
