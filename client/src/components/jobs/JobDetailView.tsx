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
} from "@mui/material";
import {
    Close,
    Flag,
    Business,
    CalendarToday,
    Language,
    ErrorOutline,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { format, isAfter, parseISO } from "date-fns";
import JobApplication from "./JobApplication";
import { useState } from "react";

// Update the interface to match your actual job structure
interface Job {
    id: number;
    title: string;
    description: string;
    final_date: string;
    uploaded_at: string;
    accepted: boolean;
    user_id: number;
    company_name: string;
    company_address: string;
    company_website: string;
    salary: string; // Starting salary
}

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

    // Color for closing date - #D32F2F for light theme, brighter/more visible for dark theme
    const closingDateColor = darkmode ? "#FF6B6B" : "#D32F2F";

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
                },
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    position: "relative",
                    overflow: "auto",
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        pb: 1.5,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        position: "sticky",
                        top: 0,
                        backgroundColor: theme.palette.background.paper,
                        zIndex: 10,
                    }}
                >
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
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
                                label={applicationClosed ? "Closed" : "Active"}
                                size="small"
                                color={applicationClosed ? "error" : "success"}
                                sx={{
                                    height: 24,
                                    fontWeight: "bold",
                                    color: "#fff",
                                }}
                            />
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} size="medium">
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
                    <Box sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                mb: 1,
                                gap: 0.5,
                                rowGap: 0.75,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Business
                                    sx={{
                                        mr: 1,
                                        color: theme.palette.text.secondary,
                                    }}
                                />
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                    sx={{ fontWeight: "medium" }}
                                >
                                    {job.company_name}
                                </Typography>
                            </Box>

                            {job.company_address && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        sx={{
                                            mr: 0.5,
                                        }}
                                    >
                                        |
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        color="text.primary"
                                        sx={{
                                            "@media (max-width: 429px)": {
                                                mr: 1,
                                            },
                                        }}
                                    >
                                        {job.company_address}
                                    </Typography>
                                </Box>
                            )}

                            {job.salary && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        sx={{
                                            display: {
                                                xs: "none",
                                                mobile: "block",
                                            },
                                            mr: 0.5,
                                        }}
                                    >
                                        |
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.primary"
                                    >
                                        ${job.salary} (negotiable)
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Application closing date */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                            }}
                        >
                            <CalendarToday
                                sx={{
                                    mr: 1,
                                    color: closingDateColor,
                                }}
                            />
                            <Typography
                                variant="body1"
                                fontWeight="medium"
                                sx={{ color: closingDateColor }}
                            >
                                {applicationClosed
                                    ? "Closed on: "
                                    : "Closing: "}
                                {formatDate(job.final_date)}
                            </Typography>
                        </Box>

                        {/* Company website if available */}
                        {job.company_website && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                                >
                                    Company Website
                                </Link>
                            </Box>
                        )}
                    </Box>

                    {/* Description */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Job Description
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: darkmode ? "#FFFFFF" : "#333",
                                whiteSpace: "pre-line", // Preserve line breaks in description
                            }}
                        >
                            {job.description}
                        </Typography>
                    </Box>

                    {/* Posted date */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            Posted {formatDate(job.uploaded_at)}
                        </Typography>
                    </Box>

                    {/* Action buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: isMobile ? "column-reverse" : "row",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<Flag />}
                            onClick={() => onReport(job.id)}
                            color="error"
                            sx={{
                                alignSelf: isMobile ? "stretch" : "flex-start",
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
                                            py: 1,
                                            opacity: applicationClosed
                                                ? 0.7
                                                : 1,
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
