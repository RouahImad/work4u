import { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Grid,
    CardContent,
    InputAdornment,
    CircularProgress,
    Theme,
    CardActionArea,
    Chip,
    Button,
    Collapse,
    IconButton,
    Fade,
    Avatar,
    Paper,
    Divider,
} from "@mui/material";
import {
    Search,
    LocationOn,
    Business,
    CalendarToday,
    FilterList,
    Clear,
    WorkOutline,
    AttachMoney,
    AccessTime,
} from "@mui/icons-material";
import JobDetailView from "./JobDetailView";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import ReportJobDialog from "./ReportJobDialog";
import { useJobPost } from "../../contexts/JobPostContext";
import { Job } from "../../types/Job.types";

const JobsFeed = ({ darkmode, theme }: { darkmode: boolean; theme: Theme }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        location: "",
        company: "",
        salaire: "",
    });
    const { fetchAllJobs, jobs } = useJobPost();

    // Selected job state
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    // Report modal state
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [currentJobId, setCurrentJobId] = useState<number | null>(null);

    const [searchVisible, setSearchVisible] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                await fetchAllJobs();
            } finally {
                setLoading(false);
            }
            setTimeout(() => {
                setLoading(false);
            }, 700);
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
    };

    const handleReportClose = () => {
        setReportModalOpen(false);
        setCurrentJobId(null);
    };

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
        if (filtersVisible && !searchVisible) {
            setFiltersVisible(false);
        }
        // Clear search when hiding
        if (searchVisible) {
            setSearchTerm("");
        }
    };

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
        if (!filtersVisible && !searchVisible) {
            setSearchVisible(true);
        }
        // Clear filters when hiding
        if (filtersVisible) {
            setFilters({
                location: "",
                company: "",
                salaire: "",
            });
        }
    };

    const clearAll = () => {
        setSearchTerm("");
        setFilters({
            location: "",
            company: "",
            salaire: "",
        });
    };

    // Apply filters and search
    const filteredJobs = jobs.filter((job) => {
        // Only show accepted jobs
        // if (!job.accepted) return false;

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

        const matchesSalary = filters.salaire
            ? job.salaire && job.salaire >= parseFloat(filters.salaire)
            : true;

        return (
            matchesSearch && matchesLocation && matchesCompany && matchesSalary
        );
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Typography variant="h4" component="h1">
                    Find Your Dream Job
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant={searchVisible ? "contained" : "outlined"}
                        startIcon={<Search />}
                        onClick={toggleSearch}
                        size="small"
                    >
                        Search
                    </Button>
                    <Button
                        variant={filtersVisible ? "contained" : "outlined"}
                        startIcon={<FilterList />}
                        onClick={toggleFilters}
                        size="small"
                        disabled={!searchVisible}
                    >
                        Filters
                    </Button>
                    {(searchTerm || filters.location || filters.company) && (
                        <IconButton
                            size="small"
                            onClick={clearAll}
                            color="primary"
                            sx={{ ml: 1 }}
                        >
                            <Clear />
                        </IconButton>
                    )}
                </Box>
            </Box>

            {/* Search and filters area */}
            <Collapse in={searchVisible} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {/* Search bar */}
                    <Fade in={searchVisible}>
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
                    </Fade>

                    {/* Filters */}
                    <Collapse in={filtersVisible}>
                        <Grid container spacing={2}>
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
                                    placeholder="Minimum salary"
                                    variant="outlined"
                                    name="salary"
                                    type="number"
                                    value={filters.salaire}
                                    onChange={handleFilterChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <span
                                                    style={{
                                                        fontSize: "1.25rem",
                                                        color: darkmode
                                                            ? "#fff"
                                                            : "rgba(0, 0, 0, 0.54)",
                                                    }}
                                                >
                                                    $
                                                </span>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Collapse>
                </Box>
            </Collapse>

            {/* Active filters display */}
            {(searchTerm ||
                filters.location ||
                filters.company ||
                filters.salaire) && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {searchTerm && (
                        <Chip
                            label={`Search: ${searchTerm}`}
                            onDelete={() => setSearchTerm("")}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    )}
                    {filters.location && (
                        <Chip
                            label={`Location: ${filters.location}`}
                            onDelete={() =>
                                setFilters({ ...filters, location: "" })
                            }
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    )}
                    {filters.company && (
                        <Chip
                            label={`Company: ${filters.company}`}
                            onDelete={() =>
                                setFilters({ ...filters, company: "" })
                            }
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    )}
                    {filters.salaire && (
                        <Chip
                            label={`Min Salary: $${filters.salaire}`}
                            onDelete={() =>
                                setFilters({ ...filters, salaire: "" })
                            }
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    )}
                </Box>
            )}

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
                                <Paper
                                    elevation={1}
                                    sx={{
                                        borderRadius: 2,
                                        overflow: "hidden",
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
                                        <CardContent sx={{ p: 0 }}>
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    borderLeft: `5px solid ${theme.palette.primary.main}`,
                                                }}
                                            >
                                                {/* Job header section */}
                                                <Grid
                                                    container
                                                    spacing={2}
                                                    alignItems="center"
                                                >
                                                    <Grid item xs={12} md={8}>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "flex-start",
                                                                gap: 2,
                                                            }}
                                                        >
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: `${theme.palette.primary.main}15`,
                                                                    color: theme
                                                                        .palette
                                                                        .primary
                                                                        .main,
                                                                    display: {
                                                                        xs: "none",
                                                                        sm: "flex",
                                                                    },
                                                                }}
                                                            >
                                                                <WorkOutline />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography
                                                                    variant="h6"
                                                                    component="h2"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                        mb: 0.5,
                                                                        color: theme
                                                                            .palette
                                                                            .text
                                                                            .primary,
                                                                    }}
                                                                >
                                                                    {job.title}
                                                                </Typography>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: 1,
                                                                    }}
                                                                >
                                                                    <Business fontSize="small" />
                                                                    {
                                                                        job.company_name
                                                                    }
                                                                    {job.company_address && (
                                                                        <>
                                                                            <Typography
                                                                                component="span"
                                                                                sx={{
                                                                                    mx: 0.5,
                                                                                }}
                                                                            >
                                                                                •
                                                                            </Typography>
                                                                            <LocationOn fontSize="small" />
                                                                            {
                                                                                job.company_address
                                                                            }
                                                                        </>
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12} md={4}>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                gap: 1,
                                                                justifyContent:
                                                                    {
                                                                        xs: "flex-start",
                                                                        md: "flex-end",
                                                                    },
                                                                flexWrap:
                                                                    "wrap",
                                                            }}
                                                        >
                                                            {job.salaire && (
                                                                <Chip
                                                                    icon={
                                                                        <AttachMoney fontSize="small" />
                                                                    }
                                                                    label={`${job.salaire}`}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: `${theme.palette.success.main}15`,
                                                                        color: theme
                                                                            .palette
                                                                            .success
                                                                            .dark,
                                                                        borderColor:
                                                                            "transparent",
                                                                        fontWeight: 500,
                                                                        "& .MuiChip-icon":
                                                                            {
                                                                                color: "inherit",
                                                                            },
                                                                    }}
                                                                />
                                                            )}

                                                            <Chip
                                                                icon={
                                                                    <CalendarToday fontSize="small" />
                                                                }
                                                                label={`${
                                                                    isAfter(
                                                                        new Date(),
                                                                        new Date(
                                                                            job.final_date
                                                                        )
                                                                    )
                                                                        ? "Closed"
                                                                        : "Deadline"
                                                                }: ${format(
                                                                    new Date(
                                                                        job.final_date
                                                                    ),
                                                                    "MMM d, yyyy"
                                                                )}`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor:
                                                                        isAfter(
                                                                            new Date(),
                                                                            new Date(
                                                                                job.final_date
                                                                            )
                                                                        )
                                                                            ? `${theme.palette.error.main}15`
                                                                            : `${theme.palette.primary.main}15`,
                                                                    color: isAfter(
                                                                        new Date(),
                                                                        new Date(
                                                                            job.final_date
                                                                        )
                                                                    )
                                                                        ? theme
                                                                              .palette
                                                                              .error
                                                                              .main
                                                                        : theme
                                                                              .palette
                                                                              .primary
                                                                              .main,
                                                                    borderColor:
                                                                        "transparent",
                                                                    fontWeight: 500,
                                                                    "& .MuiChip-icon":
                                                                        {
                                                                            color: "inherit",
                                                                        },
                                                                }}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                                <Divider sx={{ my: 2 }} />

                                                {/* Job description preview */}
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: theme.palette
                                                            .text.secondary,
                                                        lineHeight: 1.6,
                                                        mb: 2,
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                    }}
                                                >
                                                    {job.description}
                                                </Typography>

                                                {/* Job footer */}
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                        mt: 1,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        <AccessTime
                                                            sx={{
                                                                fontSize: 16,
                                                                color: theme
                                                                    .palette
                                                                    .text
                                                                    .secondary,
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Posted{" "}
                                                            {formatPostedDate(
                                                                job.uploaded_at ??
                                                                    new Date().toISOString()
                                                            )}
                                                        </Typography>
                                                    </Box>

                                                    <Button
                                                        variant="text"
                                                        color="primary"
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                            px: 1.5,
                                                            "&:hover": {
                                                                bgcolor: `${theme.palette.primary.main}15`,
                                                            },
                                                        }}
                                                        endIcon={
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    transition:
                                                                        "transform 0.2s",
                                                                    display:
                                                                        "inline-flex",
                                                                }}
                                                            >
                                                                →
                                                            </Box>
                                                        }
                                                    >
                                                        View Details
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Paper
                                elevation={0}
                                sx={{
                                    textAlign: "center",
                                    py: 5,
                                    px: 3,
                                    borderRadius: 2,
                                    bgcolor: `${theme.palette.primary.main}05`,
                                    border: `1px dashed ${theme.palette.primary.main}40`,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mb: 2,
                                    }}
                                >
                                    <Search
                                        sx={{
                                            fontSize: 60,
                                            color: `${theme.palette.primary.main}40`,
                                        }}
                                    />
                                </Box>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    No jobs found matching your criteria
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Try adjusting your search terms or filters
                                    to find more opportunities
                                </Typography>
                            </Paper>
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
                />
            )}

            <ReportJobDialog
                open={reportModalOpen}
                onClose={handleReportClose}
                jobId={currentJobId}
                darkmode={darkmode}
            />
        </Container>
    );
};

export default JobsFeed;
