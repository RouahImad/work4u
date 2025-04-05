import React, { useState } from "react";
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
    IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { useNotification } from "../notifications/SlideInNotifications";

interface ReportJobDialogProps {
    open: boolean;
    onClose: () => void;
    jobId: number | null;
    darkmode: boolean;
}

const ReportJobDialog = ({
    open,
    onClose,
    jobId,
    darkmode,
}: ReportJobDialogProps) => {
    const [reportReason, setReportReason] = useState("");
    const [reportDescription, setReportDescription] = useState("");
    const [reportSubmitting, setReportSubmitting] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(false);

    const { pushNotification } = useNotification();

    const handleReportDescriptionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setReportDescription(e.target.value);
    };

    const handleReportSubmit = async () => {
        if (!jobId) return;

        setReportSubmitting(true);

        try {
            // Replace with your actual API endpoint
            await axios.post("/api/jobs/report", {
                jobId: jobId,
                reason: reportReason,
                description: reportDescription,
            });

            setReportSuccess(true);
            pushNotification(
                "Your report has been submitted successfully.",
                "success"
            );

            // Close dialog after showing success for a moment
            setTimeout(() => {
                handleClose();
            }, 2200);
        } catch (error) {
            console.error("Failed to submit report:", error);
            pushNotification(
                "Failed to submit report. Please try again.",
                "error"
            );
        } finally {
            setReportSubmitting(false);
        }
    };

    const handleClose = () => {
        // Only allow closing if not submitting
        if (!reportSubmitting) {
            // Reset the form state when closing
            setReportReason("");
            setReportDescription("");
            setReportSuccess(false);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={reportSubmitting ? undefined : handleClose}
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
                {reportSuccess ? "Report Submitted" : "Report Job Posting"}
                {!reportSubmitting && !reportSuccess && (
                    <IconButton onClick={handleClose} size="small">
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent>
                {reportSuccess ? (
                    <Box sx={{ textAlign: "center", py: 2 }}>
                        <Typography>
                            Thank you for your report. Our team will review it
                            shortly.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography
                            variant="body2"
                            sx={{ mb: 3, color: darkmode ? "" : "#333" }}
                        >
                            Please provide details about why you're reporting
                            this job posting. Our team will review your report
                            and take appropriate action.
                        </Typography>

                        <TextField
                            label="Additional details"
                            multiline
                            rows={4}
                            fullWidth
                            value={reportDescription}
                            onChange={handleReportDescriptionChange}
                            disabled={reportSubmitting}
                            placeholder="Please provide any additional information about this issue"
                        />
                    </>
                )}
            </DialogContent>
            {!reportSuccess && (
                <DialogActions>
                    <Button onClick={handleClose} disabled={reportSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleReportSubmit}
                        variant="contained"
                        color="primary"
                        disabled={!reportReason || reportSubmitting}
                        startIcon={
                            reportSubmitting ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : null
                        }
                    >
                        {reportSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default ReportJobDialog;
