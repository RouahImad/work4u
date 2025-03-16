import { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    InputAdornment,
    CircularProgress,
    Theme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    CardActionArea,
} from "@mui/material";
import {
    Search,
    LocationOn,
    Business,
    AttachMoney,
    Flag,
    Close,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import JobDetailView from "./JobDetailView";

// Mock job data
const mockJobs = [
    {
        id: 1,
        title: "Full Stack Developer",
        company: "TechCorp",
        location: "New York, NY",
        salary: "$80,000 - $120,000",
        description:
            "We are looking for a Full Stack Developer to build and maintain our web applications...",
        tags: ["React", "Node.js", "MongoDB", "TypeScript"],
        posted: "2 days ago",
    },
    {
        id: 2,
        title: "UX/UI Designer",
        company: "DesignHub",
        location: "San Francisco, CA",
        salary: "$90,000 - $110,000",
        description:
            "Join our creative team to design beautiful and functional user interfaces...",
        tags: ["Figma", "Adobe XD", "User Research", "Wireframing"],
        posted: "1 week ago",
    },
    {
        id: 3,
        title: "DevOps Engineer",
        company: "CloudSystems",
        location: "Remote",
        salary: "$100,000 - $140,000",
        description:
            "Help us build and maintain our cloud infrastructure and CI/CD pipelines...",
        tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        posted: "3 days ago",
    },
    {
        id: 4,
        title: "Data Scientist",
        company: "DataInsights",
        location: "Boston, MA",
        salary: "$110,000 - $150,000",
        description:
            "Use machine learning and statistical analysis to unlock insights from our data...",
        tags: ["Python", "Machine Learning", "SQL", "Data Visualization"],
        posted: "Just now",
    },
    {
        id: 5,
        title: "Mobile Developer",
        company: "AppWorks",
        location: "Austin, TX",
        salary: "$85,000 - $115,000",
        description:
            "Build native mobile applications for iOS and Android platforms...",
        tags: ["Swift", "Kotlin", "React Native", "Mobile Design"],
        posted: "5 days ago",
    },
];

// Report reason options
const reportReasons = [
    "Fraudulent job posting",
    "Misleading information",
    "Discriminatory content",
    "Spam or scam",
    "Duplicate posting",
    "Other",
];

const JobsFeed = ({ darkmode, theme }: { darkmode: boolean; theme: Theme }) => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState(mockJobs);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        location: "",
        company: "",
        salary: "",
    });

    // Selected job state
    const [selectedJob, setSelectedJob] = useState<(typeof mockJobs)[0] | null>(
        null
    );
    const [detailOpen, setDetailOpen] = useState(false);

    // Report modal state
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportDescription, setReportDescription] = useState("");
    const [currentJobId, setCurrentJobId] = useState<number | null>(null);
    const [reportSubmitting, setReportSubmitting] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(false);

    // Simulate loading jobs from API
    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setJobs(mockJobs);
            setLoading(false);
        }, 800);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    // Job detail handlers
    const handleJobClick = (job: (typeof mockJobs)[0]) => {
        setSelectedJob(job);
        setDetailOpen(true);

        // Update URL without refreshing the page (for direct linking)
        // history.pushState(null, "", `/jobs/${job.id}`);
        // You could also use react-router:
        // navigate(`/jobs/${job.id}`);
    };

    const handleDetailClose = () => {
        setDetailOpen(false);
        // Reset URL
        // history.pushState(null, "", "/jobs");
    };

    // Report handling functions
    const handleReportClick = (jobId: number) => {
        setCurrentJobId(jobId);
        setReportModalOpen(true);
        setReportReason("");
        setReportDescription("");
        setReportSuccess(false);
    };

    const handleReportClose = () => {
        setReportModalOpen(false);
    };

    const handleReportReasonChange = (e: any) => {
        setReportReason(e.target.value);
    };

    const handleReportDescriptionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setReportDescription(e.target.value);
    };

    const handleReportSubmit = () => {
        const currentUserId = "user123"; // Placeholder for actual user ID

        setReportSubmitting(true);

        // Simulate API call to submit report
        setTimeout(() => {
            // In a real app, this would be an API call:
            console.log("Report submitted:", {
                jobId: currentJobId,
                userId: currentUserId,
                reason: reportReason,
                description: reportDescription,
                timestamp: new Date().toISOString(),
            });

            setReportSubmitting(false);
            setReportSuccess(true);

            // Close dialog after showing success for a moment
            setTimeout(() => {
                setReportModalOpen(false);
            }, 2200);
        }, 1000);
    };

    // Apply filters and search
    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation = filters.location
            ? job.location
                  .toLowerCase()
                  .includes(filters.location.toLowerCase())
            : true;
        const matchesCompany = filters.company
            ? job.company.toLowerCase().includes(filters.company.toLowerCase())
            : true;
        const matchesSalary = filters.salary
            ? job.salary.toLowerCase().includes(filters.salary.toLowerCase())
            : true;

        return (
            matchesSearch && matchesLocation && matchesCompany && matchesSalary
        );
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Find Your Dream Job
            </Typography>

            {/* Search bar */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Search for jobs, skills or companies"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        placeholder="Filter by location"
                        variant="outlined"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationOn />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        placeholder="Filter by company"
                        variant="outlined"
                        name="company"
                        value={filters.company}
                        onChange={handleFilterChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Business />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        placeholder="Filter by salary"
                        variant="outlined"
                        name="salary"
                        value={filters.salary}
                        onChange={handleFilterChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoney />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>

            {/* Job listings - Simplified View */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <Grid item xs={12} key={job.id}>
                                <Card
                                    sx={{
                                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                                        transition:
                                            "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => handleJobClick(job)}
                                    >
                                        <CardContent>
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    component="h2"
                                                    gutterBottom
                                                >
                                                    {job.title}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="text.secondary"
                                                >
                                                    {job.company} •{" "}
                                                    {job.location}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 1,
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: !darkmode
                                                                ? "#333"
                                                                : "",
                                                        }}
                                                    >
                                                        {job.description.substring(
                                                            0,
                                                            100
                                                        )}
                                                        ...
                                                    </span>
                                                    <span>
                                                        Posted {job.posted}
                                                    </span>
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: "center", py: 4 }}>
                                <Typography variant="h6">
                                    No jobs found matching your criteria
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Try adjusting your search filters
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Job Detail View */}
            {selectedJob && (
                <JobDetailView
                    job={selectedJob}
                    open={detailOpen}
                    onClose={handleDetailClose}
                    onReport={handleReportClick}
                    darkmode={darkmode}
                />
            )}

            {/* Report Job Dialog */}
            <Dialog
                open={reportModalOpen}
                onClose={reportSubmitting ? undefined : handleReportClose}
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
                        <IconButton onClick={handleReportClose} size="small">
                            <Close />
                        </IconButton>
                    )}
                </DialogTitle>
                <DialogContent>
                    {reportSuccess ? (
                        <Box sx={{ textAlign: "center", py: 2 }}>
                            <Typography>
                                Thank you for your report. Our team will review
                                it shortly.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Typography
                                variant="body2"
                                sx={{ mb: 3, color: "#333" }}
                            >
                                Please provide details about why you're
                                reporting this job posting. Our team will review
                                your report and take appropriate action.
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Reason for reporting</InputLabel>
                                <Select
                                    value={reportReason}
                                    onChange={handleReportReasonChange}
                                    label="Reason for reporting"
                                    disabled={reportSubmitting}
                                >
                                    {reportReasons.map((reason) => (
                                        <MenuItem key={reason} value={reason}>
                                            {reason}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

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
                        <Button
                            onClick={handleReportClose}
                            disabled={reportSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReportSubmit}
                            variant="contained"
                            color="primary"
                            disabled={!reportReason || reportSubmitting}
                            startIcon={
                                reportSubmitting ? (
                                    <CircularProgress
                                        size={20}
                                        color="inherit"
                                    />
                                ) : null
                            }
                        >
                            {reportSubmitting
                                ? "Submitting..."
                                : "Submit Report"}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </Container>
    );
};

export default JobsFeed;
