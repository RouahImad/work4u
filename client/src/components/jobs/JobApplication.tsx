import React, { useState, useRef, useCallback } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    CircularProgress,
    Alert,
    IconButton,
} from "@mui/material";
import { Close, CheckCircleOutline } from "@mui/icons-material";
import { useCVInterview } from "../../contexts/CVInterviewContext";
import { useNotification } from "../notifications/SlideInNotifications";

interface JobApplicationProps {
    open: boolean;
    onClose: () => void;
    jobId: number;
    jobTitle: string;
}

const JobApplication = ({
    open,
    onClose,
    jobId,
    jobTitle,
}: JobApplicationProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [cvTitle, setCvTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const { uploadCV, compareWithJob, saveInterview } = useCVInterview();
    const { pushNotification } = useNotification();

    const validateFile = useCallback((selectedFile: File): boolean => {
        // Validate file is PDF
        if (selectedFile.type !== "application/pdf") {
            setError("Please upload a PDF file");
            return false;
        }

        // Validate file size (limit to 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return false;
        }

        return true;
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                setError(null);

                // Auto-generate CV title if empty
                if (!cvTitle) {
                    setCvTitle(`Application for ${jobTitle}`);
                }
            }
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Please upload your resume");
            return;
        }

        if (!cvTitle.trim()) {
            setError("Please provide a title for your resume");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // First upload the CV
            const cvId = await uploadCV(cvTitle, file);

            // Then compare it with the job
            const applicationId = await compareWithJob(cvId, jobId);

            // If comparison successful and we got an application ID
            if (applicationId) {
                // Save the interview
                await saveInterview(applicationId);

                setSuccess(true);
                pushNotification(
                    "Application submitted successfully! You can now take the interview.",
                    "success"
                );
            }

            // Close dialog after showing success for a moment
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFile(null);
                setCvTitle("");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle drag events
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Only set isDragging to false if we're leaving the drop zone and not entering a child element
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                setError(null);

                // Auto-generate CV title if empty
                if (!cvTitle) {
                    setCvTitle(`Application for ${jobTitle}`);
                }
            }
        }
    };

    return (
        <Dialog
            open={open}
            onClose={!loading ? onClose : undefined}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: 2 },
            }}
        >
            <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {success ? "Application Submitted" : `Apply for ${jobTitle}`}
                {!loading && !success && (
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>

            <DialogContent>
                {success ? (
                    <Box sx={{ textAlign: "center", py: 2 }}>
                        <CheckCircleOutline
                            color="success"
                            sx={{ fontSize: 60, mb: 2 }}
                        />
                        <Typography>
                            Your application has been submitted successfully.
                            You'll now need to complete an interview assessment.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ py: 2 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            label="Resume Title"
                            value={cvTitle}
                            onChange={(e) => setCvTitle(e.target.value)}
                            margin="normal"
                            disabled={loading}
                        />

                        <Box
                            ref={dropZoneRef}
                            sx={{
                                border: isDragging
                                    ? "2px dashed #2196f3"
                                    : file
                                    ? "2px dashed #4caf50"
                                    : "2px dashed #ccc",
                                borderRadius: 2,
                                p: 3,
                                mt: 2,
                                textAlign: "center",
                                cursor: loading ? "default" : "pointer",
                                bgcolor: isDragging
                                    ? "rgba(33, 150, 243, 0.1)"
                                    : file
                                    ? "rgba(0, 230, 118, 0.1)"
                                    : "transparent",
                                "&:hover": {
                                    bgcolor: loading
                                        ? file
                                            ? "rgba(0, 230, 118, 0.1)"
                                            : "transparent"
                                        : "rgba(0, 0, 0, 0.04)",
                                },
                            }}
                            onClick={loading ? undefined : triggerFileInput}
                            onDragEnter={loading ? undefined : handleDragEnter}
                            onDragOver={loading ? undefined : handleDragOver}
                            onDragLeave={loading ? undefined : handleDragLeave}
                            onDrop={loading ? undefined : handleDrop}
                        >
                            {loading ? (
                                <CircularProgress size={40} />
                            ) : (
                                <>
                                    {file ? (
                                        <>
                                            <CheckCircleOutline
                                                color="success"
                                                sx={{ fontSize: 40, mb: 1 }}
                                            />
                                            <Typography variant="body1">
                                                {file.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {(
                                                    file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Typography variant="body1">
                                                Upload your resume (PDF)
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Click or drag and drop your file
                                                here
                                            </Typography>
                                        </>
                                    )}
                                </>
                            )}
                        </Box>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 1 }}
                        >
                            PDF format only, max 5MB
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.lowGray"
                            sx={{ display: "block", mt: 0.5 }}
                        >
                            Note: For best results, please ensure your resume is
                            in English to improve matching accuracy.
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            {!success && (
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading || !file}
                        startIcon={
                            loading ? <CircularProgress size={20} /> : null
                        }
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default JobApplication;
