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
    CardActionArea,
    Chip,
} from "@mui/material";
import {
    Search,
    LocationOn,
    Business,
    Close,
    CalendarToday,
} from "@mui/icons-material";
import JobDetailView from "./JobDetailView";
import { useNotification } from "./notifications/SlideInNotifications";
import axios from "axios";
import { format, formatDistanceToNow, isAfter } from "date-fns";

interface Job {
    id: number;
    title: string;
    description: string;
    final_date: string; // Expected ISO date string
    uploaded_at: string; // Expected ISO date string
    accepted: boolean;
    user_id: number;
    // Additional info
    company_name: string;
    company_address?: string;
    company_website?: string;
    // Optional fields you might need for UI display
    salary?: string;
}

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
    const [jobs, setJobs] = useState<Job[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        location: "",
        company: "",
    });
    const { pushNotification } = useNotification();

    // Selected job state
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    // Report modal state
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportDescription, setReportDescription] = useState("");
    const [currentJobId, setCurrentJobId] = useState<number | null>(null);
    const [reportSubmitting, setReportSubmitting] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(false);

    // Fetch jobs from API
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                // const response = await axios.get("/api/jobs");
                // setJobs(response.data);
                setJobs([
                    {
                        id: 1,
                        title: "Full Stack Developer",
                        description:
                            "We are looking for a Full Stack Developer to build and maintain our web applications Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quamquae consequuntur commodi quas excepturi, quasi, natusrepudiandae porro sapiente, saepe quibusdam quaerat asperioresaccusantium maiores eveniet id ducimus perspiciatis ullam.",
                        final_date: new Date(
                            Date.now() + 30 * 24 * 60 * 60 * 1000
                        ).toISOString(), // 30 days from now
                        uploaded_at: new Date(
                            Date.now() - 2 * 24 * 60 * 60 * 1000
                        ).toISOString(), // 2 days ago
                        accepted: true,
                        user_id: 1,
                        company_name: "TechCorp",
                        company_address: "New York, NY",
                        company_website: "https://techcorp.example.com",
                        salary: "80,000",
                    },
                    {
                        id: 2,
                        title: "UX/UI Designer",
                        description:
                            "Join our creative team to design beautiful and functional user interfaces Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quamquae consequuntur commodi quas excepturi, quasi, natusrepudiandae porro sapiente, saepe quibusdam quaerat asperioresaccusantium maiores eveniet id ducimus perspiciatis ullam.",
                        final_date: new Date(
                            Date.now() + 20 * 24 * 60 * 60 * 1000
                        ).toISOString(), // 20 days from now
                        uploaded_at: new Date(
                            Date.now() - 7 * 24 * 60 * 60 * 1000
                        ).toISOString(), // 7 days ago
                        accepted: true,
                        user_id: 2,
                        company_name: "DesignHub",
                        company_address: "San Francisco, CA",
                        company_website: "https://designhub.example.com",
                        salary: "90,000",
                    },
                    {
                        id: 3,
                        title: "DevOps Engineer",
                        description:
                            "Help us build and maintain our cloud infrastructure and CI/CD pipelines Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam quae consequuntur commodi quas excepturi, quasi, natus repudiandae porro sapiente, saepe quibusdam quaerat asperiores accusantium maiores eveniet id ducimus perspiciatis ullam.",
                        final_date: new Date(
                            Date.now() + 15 * 24 * 60 * 60 * 1000
                        ).toISOString(), // 15 days from now
                        uploaded_at: new Date(
                            Date.now() - 3 * 24 * 60 * 60 * 1000
                        ).toISOString(), // 3 days ago
                        accepted: true,
                        user_id: 1,
                        company_name: "CloudSystems",
                        company_address: "Remote",
                        company_website: "https://cloudsystems.example.com",
                        salary: "100,000",
                    },
                    {
                        id: 4,
                        title: "Data Scientist",
                        description:
                            "Use machine learning and statistical analysis to unlock insights from our data Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quamquae consequuntur commodi quas excepturi, quasi, natusrepudiandae porro sapiente, saepe quibusdam quaerat asperioresaccusantium maiores eveniet id ducimus perspiciatis ullam.",
                        final_date: new Date(
                            Date.now() + 10 * 24 * 60 * 60 * 1000
                        ).toISOString(), // 10 days from now
                        uploaded_at: new Date().toISOString(), // Just now
                        accepted: true,
                        user_id: 3,
                        company_name: "DataInsights",
                        company_address: "Boston, MA",
                        company_website: "https://datainsights.example.com",
                        salary: "110,000",
                    },
                    {
                        id: 5,
                        title: "Mobile Developer",
                        description:
                            "Build native mobile applications for iOS and Android platforms Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quamquae consequuntur commodi quas excepturi, quasi, natusrepudiandae porro sapiente, saepe quibusdam quaerat asperioresaccusantium maiores eveniet id ducimus perspiciatis ullam.",
                        final_date: new Date(
                            Date.now() - 5 * 24 * 60 * 60 * 1000
                        ).toISOString(), // 25 days from now
                        uploaded_at: new Date(
                            Date.now() - 15 * 24 * 60 * 60 * 1000
                        ).toISOString(), // 5 days ago
                        accepted: true,
                        user_id: 2,
                        company_name: "AppWorks",
                        company_address: "Austin, TX",
                        company_website: "https://appworks.example.com",
                        salary: "85,000",
                    },
                ]);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                pushNotification(
                    "Failed to load jobs. Please try again later.",
                    "error"
                );
            }
            // finally {
            //     setLoading(false);
            // }
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        };

        fetchJobs();
    }, []);

    // Format the posted date for display
    const formatPostedDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            // If it's less than 14 days ago, show "X days ago"
            const now = new Date();
            const diffInDays = Math.floor(
                (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (diffInDays < 1) {
                return "Today";
            } else if (diffInDays < 14) {
                return formatDistanceToNow(date, { addSuffix: true });
            } else {
                return format(date, "MMM d, yyyy");
            }
        } catch (error) {
            console.error("Date formatting error:", error);
            return "Unknown date";
        }
    };

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
    const handleJobClick = (job: Job) => {
        setSelectedJob(job);
        setDetailOpen(true);
    };

    const handleDetailClose = () => {
        setDetailOpen(false);
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

    const handleReportSubmit = async () => {
        setReportSubmitting(true);

        try {
            // Replace with your actual API endpoint
            await axios.post("/api/jobs/report", {
                jobId: currentJobId,
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
                setReportModalOpen(false);
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

    // Apply filters and search
    const filteredJobs = jobs.filter((job) => {
        // Only show accepted jobs
        if (!job.accepted) return false;

        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation = filters.location
            ? job.company_address
                  ?.toLowerCase()
                  .includes(filters.location.toLowerCase()) ?? false
            : true;

        const matchesCompany = filters.company
            ? job.company_name
                  ?.toLowerCase()
                  .includes(filters.company.toLowerCase()) ?? false
            : true;

        return matchesSearch && matchesLocation && matchesCompany;
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
                    placeholder="Search for jobs"
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
            </Grid>

            {/* Job listings */}
            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        my: 4,
                    }}
                >
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                        Loading job opportunities...
                    </Typography>
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
                                                    {job.company_name}
                                                    {job.company_address
                                                        ? ` • ${job.company_address}`
                                                        : ""}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        mt: 1,
                                                        display: "flex",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    <Chip
                                                        icon={
                                                            <CalendarToday
                                                                fontSize="small"
                                                                sx={{
                                                                    color: "inherit",
                                                                }}
                                                            />
                                                        }
                                                        label={`${
                                                            isAfter(
                                                                new Date(),
                                                                new Date(
                                                                    job.final_date
                                                                )
                                                            )
                                                                ? "Closed on"
                                                                : "Closing"
                                                        }: ${format(
                                                            new Date(
                                                                job.final_date
                                                            ),
                                                            "MMM d, yyyy"
                                                        )}`}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                            padding: "4px 6px",
                                                            color: isAfter(
                                                                new Date(),
                                                                new Date(
                                                                    job.final_date
                                                                )
                                                            )
                                                                ? "#D32F2F"
                                                                : theme.palette
                                                                      .primary
                                                                      .main,
                                                            borderColor:
                                                                "currentcolor",
                                                            "& .MuiChip-icon": {
                                                                color: "inherit", // This is a fallback to ensure icon color matches
                                                            },
                                                        }}
                                                    />
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 1,
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        flexDirection: {
                                                            xs: "column",
                                                            sm: "row",
                                                        },
                                                        gap: { xs: 1, sm: 0 },
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: !darkmode
                                                                ? "#333"
                                                                : "",
                                                            maxWidth: "100%",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                        }}
                                                    >
                                                        {job.description.substring(
                                                            0,
                                                            100
                                                        )}
                                                        ...
                                                    </span>
                                                    <span
                                                        style={{
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        Posted{" "}
                                                        {formatPostedDate(
                                                            job.uploaded_at
                                                        )}
                                                    </span>
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "flex-end",
                                                        mt: 1.5,
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="primary"
                                                        sx={{
                                                            fontWeight:
                                                                "medium",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        View details
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                ml: 0.5,
                                                                display:
                                                                    "inline-flex",
                                                                alignItems:
                                                                    "center",
                                                                transition:
                                                                    "transform 0.2s",
                                                                "&:hover": {
                                                                    transform:
                                                                        "translateX(2px)",
                                                                },
                                                            }}
                                                        >
                                                            →
                                                        </Box>
                                                    </Typography>
                                                </Box>
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
                                sx={{ mb: 3, color: darkmode ? "" : "#333" }}
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
