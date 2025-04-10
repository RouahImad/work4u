import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Paper,
    Box,
    Typography,
    Chip,
    Divider,
    IconButton,
    CircularProgress,
    Alert,
    Button,
    Grid,
    Avatar,
    Tooltip,
    // useMediaQuery,
} from "@mui/material";
import {
    Close,
    CalendarToday,
    AttachMoney,
    Edit as EditIcon,
    LocationOn,
    Business,
    WorkOutline,
    AccessTime,
} from "@mui/icons-material";
import { isAfter, parseISO } from "date-fns";
import { useJobPost } from "../../contexts/JobPostContext";
import { useTheme } from "@mui/material/styles";
import { JobPost, Job } from "../../types/Job.types";
import { formatDate } from "../../services/utils";

interface JobViewProps {
    open: boolean;
    onClose: () => void;
    jobId: number;
    setViewedJob?: (job: JobPost | null) => void;
    onEdit: (jobId: number) => void;
    job?: Job | null; // Optional job object
}

const JobView: React.FC<JobViewProps> = ({
    open,
    onClose,
    jobId,
    setViewedJob,
    onEdit,
    job = null,
}) => {
    const { currentJob, fetchJobById, loading, error } = useJobPost();
    const theme = useTheme();
    const [localJob, setLocalJob] = useState<Job | null>(null);
    const [localLoading, setLocalLoading] = useState<boolean>(false);

    // Determine if we need to fetch the job or use the provided one
    useEffect(() => {
        if (job) {
            // If a job is provided via props, use it
            setLocalJob(job);
            if (setViewedJob) setViewedJob(job);
            setLocalLoading(false);
        } else {
            // Otherwise fetch the job
            setLocalLoading(true);
            fetchJobById(jobId);
        }
    }, [job, jobId]);

    // Handle the fetched job if we had to fetch it
    useEffect(() => {
        if (!job && currentJob) {
            setLocalJob(currentJob);
            if (setViewedJob) setViewedJob(currentJob);
            setLocalLoading(false);
        }
    }, [currentJob, setViewedJob, job]);

    // Clean up when component unmounts or dialog closes
    useEffect(() => {
        return () => {
            if (!open && setViewedJob) {
                setViewedJob(null);
            }
        };
    }, [open, setViewedJob]);

    const isApplicationClosed = (job: JobPost) => {
        try {
            const finalDate = parseISO(job.final_date);
            const today = new Date();
            return isAfter(today, finalDate);
        } catch (error) {
            return false;
        }
    };

    const handleEditClick = () => {
        if (jobId && onEdit) {
            onEdit(jobId);
            onClose();
        }
    };

    // Determine loading and error states
    const isLoading = job ? false : localLoading || loading;
    const displayError = !job && error;
    const displayJob = localJob || job;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: "hidden",
                    maxHeight: "90vh",
                },
            }}
        >
            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : displayError ? (
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            ) : displayJob ? (
                <>
                    <DialogTitle
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 3,
                            pb: 2,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.default,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 50,
                                    height: 50,
                                    display: { xs: "none", sm: "flex" },
                                }}
                            >
                                <WorkOutline />
                            </Avatar>
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {displayJob.title}
                                    </Typography>
                                    <Chip
                                        label={
                                            isApplicationClosed(displayJob)
                                                ? "Closed"
                                                : "Active"
                                        }
                                        size="small"
                                        color={
                                            isApplicationClosed(displayJob)
                                                ? "error"
                                                : "success"
                                        }
                                        sx={{
                                            height: 24,
                                            fontWeight: "bold",
                                            color: "#fff",
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                >
                                    {displayJob.company_name || "Company Name"}
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton
                            onClick={onClose}
                            size="medium"
                            sx={{
                                bgcolor: `${theme.palette.grey[200]}60`,
                                "&:hover": { bgcolor: theme.palette.grey[300] },
                            }}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent
                        dividers
                        sx={{
                            p: 0,
                            "&::-webkit-scrollbar": {
                                width: "8px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: `${theme.palette.primary.main}40`,
                                borderRadius: "4px",
                            },
                        }}
                    >
                        <Paper elevation={0} sx={{ p: 3 }}>
                            {/* Key job details section */}
                            <Box
                                sx={{
                                    mb: 4,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: `${theme.palette.primary.main}08`,
                                }}
                            >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Tooltip title="Salary">
                                                <Avatar
                                                    sx={{
                                                        mr: 1.5,
                                                        bgcolor: `${theme.palette.primary.main}20`,
                                                        color: theme.palette
                                                            .primary.main,
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                >
                                                    <AttachMoney />
                                                </Avatar>
                                            </Tooltip>
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Salary
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="medium"
                                                >
                                                    $
                                                    {displayJob.salaire ||
                                                        "Negotiable"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Tooltip title="Location">
                                                <Avatar
                                                    sx={{
                                                        mr: 1.5,
                                                        bgcolor: `${theme.palette.primary.main}20`,
                                                        color: theme.palette
                                                            .primary.main,
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                >
                                                    <LocationOn />
                                                </Avatar>
                                            </Tooltip>
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Location
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="medium"
                                                >
                                                    {displayJob.company_address ||
                                                        "Remote"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Tooltip title="Company">
                                                <Avatar
                                                    sx={{
                                                        mr: 1.5,
                                                        bgcolor: `${theme.palette.primary.main}20`,
                                                        color: theme.palette
                                                            .primary.main,
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                >
                                                    <Business />
                                                </Avatar>
                                            </Tooltip>
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Company
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="medium"
                                                >
                                                    {displayJob.company_name ||
                                                        "Company Name"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Tooltip title="Deadline">
                                                <Avatar
                                                    sx={{
                                                        mr: 1.5,
                                                        bgcolor: `${theme.palette.primary.main}20`,
                                                        color: theme.palette
                                                            .primary.main,
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                >
                                                    <CalendarToday />
                                                </Avatar>
                                            </Tooltip>
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {isApplicationClosed(
                                                        displayJob
                                                    )
                                                        ? "Closed on"
                                                        : "Deadline"}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="medium"
                                                >
                                                    {formatDate(
                                                        displayJob.final_date
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Job description section */}
                            <Box sx={{ mb: 4 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        fontWeight: 600,
                                        color: theme.palette.primary.main,
                                    }}
                                >
                                    <WorkOutline fontSize="small" />
                                    Job Description
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        whiteSpace: "pre-line",
                                        lineHeight: 1.7,
                                        color: theme.palette.text.primary,
                                        textAlign: "justify",
                                    }}
                                >
                                    {displayJob.description}
                                </Typography>
                            </Box>

                            {/* Additional information */}
                            <Box
                                sx={{
                                    mt: 4,
                                    mb: 2,
                                    p: 2,
                                    borderRadius: 1,
                                    bgcolor: theme.palette.background.default,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <AccessTime fontSize="small" color="action" />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Posted:{" "}
                                    {formatDate(
                                        displayJob.uploaded_at ||
                                            new Date().toISOString()
                                    )}
                                </Typography>
                            </Box>
                        </Paper>
                    </DialogContent>

                    {/* Actions */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 2.5,
                            borderTop: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.default,
                        }}
                    >
                        <Button
                            onClick={onClose}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEditClick}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                boxShadow: 2,
                            }}
                        >
                            Edit Job
                        </Button>
                    </Box>
                </>
            ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="body1">
                        Job details not found
                    </Typography>
                </Box>
            )}
        </Dialog>
    );
};

export default JobView;
