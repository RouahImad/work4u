import {
    Box,
    Typography,
    Chip,
    Button,
    IconButton,
    Tooltip,
    Dialog,
    Paper,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    Close,
    Flag,
    LocationOn,
    Business,
    AttachMoney,
} from "@mui/icons-material";
import { motion } from "framer-motion";

interface JobDetailViewProps {
    job: {
        id: number;
        title: string;
        company: string;
        location: string;
        salary: string;
        description: string;
        tags: string[];
        posted: string;
    };
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

    // Animation variants for content
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.4 },
        },
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
                {/* Header with close button */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 3,
                        pb: 1,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        position: "sticky",
                        top: 0,
                        backgroundColor: theme.palette.background.paper,
                        zIndex: 10,
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: 600 }}
                    >
                        {job.title}
                    </Typography>
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
                    {/* Company and location info */}
                    <Box sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                            }}
                        >
                            <Business
                                sx={{
                                    mr: 1,
                                    color: theme.palette.text.secondary,
                                }}
                            />
                            <Typography variant="h6" color="text.primary">
                                {job.company}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                            }}
                        >
                            <LocationOn
                                sx={{
                                    mr: 1,
                                    color: theme.palette.text.secondary,
                                }}
                            />
                            <Typography variant="body1" color="text.secondary">
                                {job.location}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AttachMoney
                                sx={{
                                    mr: 1,
                                    color: theme.palette.text.secondary,
                                }}
                            />
                            <Typography variant="body1" color="text.secondary">
                                {job.salary}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Description */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Job Description
                        </Typography>
                        <Typography
                            variant="body1"
                            paragraph
                            sx={{
                                color: darkmode ? "#FFFFFF" : "#333",
                            }}
                        >
                            {job.description}
                            {/* In a real app, this would likely be a longer description */}
                            {/* You could use a rich text renderer here if description contains HTML */}
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nullam in dui mauris. Vivamus hendrerit arcu
                            sed erat molestie vehicula. Sed auctor neque eu
                            tellus rhoncus ut eleifend nibh porttitor. Ut in
                            nulla enim. Phasellus molestie magna non est
                            bibendum non venenatis nisl tempor.
                        </Typography>
                    </Box>

                    {/* Skills/Tags */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Required Skills
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {job.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 1.5,
                                        fontWeight: 500,
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Posted date */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            Posted {job.posted}
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
                            whileTap={{ scale: 0.95 }}
                            style={{
                                alignSelf: isMobile ? "stretch" : "flex-end",
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth={isMobile}
                                sx={{ px: 4, py: 1 }}
                            >
                                Apply Now
                            </Button>
                        </motion.div>
                    </Box>
                </Box>
            </Paper>
        </Dialog>
    );
};

export default JobDetailView;
