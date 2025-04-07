import {
    Box,
    Typography,
    Chip,
    Button,
    IconButton,
    Dialog,
    Paper,
    useTheme,
    useMediaQuery,
    Link,
    Tooltip,
    Avatar,
    Grid,
    Divider,
} from "@mui/material";
import {
    Close,
    Flag,
    Business,
    CalendarToday,
    Language,
    ErrorOutline,
    LocationOn,
    AttachMoney,
    WorkOutline,
    AccessTime,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { format, isAfter, parseISO } from "date-fns";
import JobApplication from "./JobApplication";
import { useState } from "react";
import { Job } from "../../types/Job.types";

interface JobDetailViewProps {
    job: Job;
    open: boolean;
    onClose: () => void;
    onReport: (jobId: number) => void;
    darkmode: boolean;
}

const JobDetailView = ({
    job,
    open,
    onClose,
    onReport,
    darkmode,
}: JobDetailViewProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [applicationOpen, setApplicationOpen] = useState(false);

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMMM d, yyyy");
        } catch (error) {
            console.error("Date formatting error:", error);
            return "Unknown date";
        }
    };

    // Check if the application deadline has passed
    const isApplicationClosed = () => {
        try {
            const finalDate = parseISO(job.final_date);
            const today = new Date();
            return isAfter(today, finalDate);
        } catch (error) {
            console.error("Date comparison error:", error);
            return false; // If there's an error, allow application by default
        }
    };

    const applicationClosed = isApplicationClosed();

    // Animation variants for content
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.4 },
        },
    };

    const handleApplyClick = () => {
        setApplicationOpen(true);
    };

    const handleApplicationClose = () => {
        setApplicationOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 2,
                    height: isMobile ? "100%" : "auto",
                    overflow: "hidden",
                    maxHeight: "90vh",
                },
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    position: "relative",
                    overflow: "auto",
                    height: "100%",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: `${theme.palette.primary.main}40`,
                        borderRadius: "4px",
                    },
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 3,
                        pb: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        position: "sticky",
                        top: 0,
                        backgroundColor: theme.palette.background.paper,
                        zIndex: 10,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                                    {job.title}
                                </Typography>

                                <Chip
                                    label={
                                        applicationClosed ? "Closed" : "Active"
                                    }
                                    size="small"
                                    color={
                                        applicationClosed ? "error" : "success"
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
                                {job.company_name}
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
                </Box>

                {/* Content */}
                <Box
                    component={motion.div}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    sx={{ p: 3 }}
                >
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
                            {job.salaire && (
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
                                                    color: theme.palette.primary
                                                        .main,
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
                                                ${job.salaire}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            )}

                            {job.company_address && (
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
                                                    color: theme.palette.primary
                                                        .main,
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
                                                {job.company_address}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            )}

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
                                                color: theme.palette.primary
                                                    .main,
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
                                            {job.company_name}
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
                                                bgcolor: applicationClosed
                                                    ? `${theme.palette.error.main}20`
                                                    : `${theme.palette.primary.main}20`,
                                                color: applicationClosed
                                                    ? theme.palette.error.main
                                                    : theme.palette.primary
                                                          .main,
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
                                            {applicationClosed
                                                ? "Closed on"
                                                : "Deadline"}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            fontWeight="medium"
                                            color={
                                                applicationClosed
                                                    ? "error"
                                                    : "text.primary"
                                            }
                                        >
                                            {formatDate(job.final_date)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Company website if available */}
                    {job.company_website && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 3,
                                p: 1.5,
                                borderRadius: 1,
                                bgcolor: `${theme.palette.info.main}10`,
                                width: "fit-content",
                            }}
                        >
                            <Language
                                sx={{
                                    mr: 1,
                                    color: theme.palette.primary.main,
                                }}
                            />
                            <Link
                                href={
                                    job.company_website.startsWith("http")
                                        ? job.company_website
                                        : `https://${job.company_website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                                color="primary"
                                sx={{ fontWeight: "medium" }}
                            >
                                Visit Company Website
                            </Link>
                        </Box>
                    )}

                    <Divider sx={{ my: 3 }} />

                    {/* Description */}
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
                                mb: 2,
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
                            {job.description}
                        </Typography>
                    </Box>

                    {/* Posted date */}
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
                        <Typography variant="body2" color="text.secondary">
                            Posted: {formatDate(job.uploaded_at ?? "")}
                        </Typography>
                    </Box>

                    {/* Action buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: isMobile ? "column-reverse" : "row",
                            gap: 2,
                            mt: 4,
                            pt: 3,
                            borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<Flag />}
                            onClick={() => onReport(job.id)}
                            color="error"
                            sx={{
                                alignSelf: isMobile ? "stretch" : "flex-start",
                                borderRadius: 2,
                                px: 3,
                            }}
                        >
                            Report this job
                        </Button>

                        <motion.div
                            whileTap={
                                !applicationClosed ? { scale: 0.95 } : undefined
                            }
                            style={{
                                alignSelf: isMobile ? "stretch" : "flex-end",
                            }}
                        >
                            <Tooltip
                                title={
                                    applicationClosed
                                        ? "Application deadline has passed"
                                        : ""
                                }
                                placement="top"
                                arrow
                            >
                                <span>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth={isMobile}
                                        disabled={applicationClosed}
                                        startIcon={
                                            applicationClosed ? (
                                                <ErrorOutline />
                                            ) : undefined
                                        }
                                        onClick={
                                            !applicationClosed
                                                ? handleApplyClick
                                                : undefined
                                        }
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            opacity: applicationClosed
                                                ? 0.7
                                                : 1,
                                            borderRadius: 2,
                                            boxShadow: 2,
                                            fontWeight: "medium",
                                        }}
                                    >
                                        {applicationClosed
                                            ? "Applications Closed"
                                            : "Apply Now"}
                                    </Button>
                                </span>
                            </Tooltip>
                        </motion.div>
                    </Box>
                </Box>
            </Paper>
            {/* Job Application Dialog */}
            <JobApplication
                open={applicationOpen}
                onClose={handleApplicationClose}
                jobId={job.id}
                jobTitle={job.title}
            />
        </Dialog>
    );
};

export default JobDetailView;
