import React, { useEffect } from "react";
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
import { format, isAfter, parseISO } from "date-fns";
import { useJobPost } from "../../contexts/JobPostContext";
import { useTheme } from "@mui/material/styles";
import { JobPost } from "../../types/Job.types";

interface JobViewProps {
    open: boolean;
    onClose: () => void;
    jobId: number;
    setViewedJob: (job: JobPost | null) => void;
    onEdit: (jobId: number) => void;
}

const JobView: React.FC<JobViewProps> = ({
    open,
    onClose,
    jobId,
    setViewedJob,
    onEdit,
}) => {
    const { currentJob, fetchJobById, loading, error } = useJobPost();
    const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        fetchJobById(jobId);
    }, []);

    useEffect(() => {
        if (currentJob) {
            setViewedJob(currentJob);
        }

        // Clean up when component unmounts
        return () => {
            if (!open) {
                setViewedJob(null);
            }
        };
    }, [currentJob, setViewedJob, open]);

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMMM d, yyyy");
        } catch (error) {
            return "Invalid date";
        }
    };

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
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            ) : currentJob ? (
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
                                        {currentJob.title}
                                    </Typography>
                                    <Chip
                                        label={
                                            isApplicationClosed(currentJob)
                                                ? "Closed"
                                                : "Active"
                                        }
                                        size="small"
                                        color={
                                            isApplicationClosed(currentJob)
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
                                    {currentJob.company_name || "Company Name"}
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
                                                    {currentJob.salaire ||
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
                                                    {currentJob.company_address ||
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
                                                    {currentJob.company_name ||
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
                                                        currentJob
                                                    )
                                                        ? "Closed on"
                                                        : "Deadline"}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="medium"
                                                >
                                                    {formatDate(
                                                        currentJob.final_date
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
                                    {currentJob.description}
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
                                        currentJob.uploaded_at ||
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
