import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    Divider,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Menu,
    MenuItem,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Badge,
    LinearProgress,
    Skeleton,
    Avatar,
} from "@mui/material";
import {
    MoreVert,
    Add,
    WorkOutline,
    BusinessCenter,
    PersonOutline,
    CheckCircle,
    AssignmentInd,
    Schedule,
    TrendingUp,
    Visibility,
    ArrowForward,
} from "@mui/icons-material";
import {
    EmployerDashboardStats,
    EmployerDashboardApplication,
} from "../../../types/Stats.types";
import { formatDate } from "../../../services/utils";
import { useState } from "react";
import JobApplicantsView from "./job/JobApplicantsView";

// Define props interface for EmployerOverviewTab
interface EmployerOverviewProps {
    employerStats: EmployerDashboardStats | null;
    loading: boolean;
    error: string | null;
    handleViewApplicants: () => void;
    handleCreateJob: () => void;
    handleCloseJob: (jobId: number) => void;
    handleDeleteJob: (jobId: number) => void;
    setActiveTab: (tab: string) => void;
    selectedJobId: number | null;
    anchorEl: HTMLElement | null;
    handleMenuClick: (
        event: React.MouseEvent<HTMLButtonElement>,
        id: number
    ) => void;
    handleMenuClose: () => void;
}

const EmployerOverview = ({
    employerStats,
    loading,
    error,
    handleViewApplicants,
    handleCreateJob,
    handleCloseJob,
    handleDeleteJob,
    setActiveTab,
    selectedJobId,
    anchorEl,
    handleMenuClick,
    handleMenuClose,
}: EmployerOverviewProps) => {
    // State for job applicants view dialog
    const [jobApplicantsOpen, setJobApplicantsOpen] = useState(false);
    const [selectedJobApplicants, setSelectedJobApplicants] = useState<
        EmployerDashboardApplication[]
    >([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState("");

    // If loading or employerStats is null, show loading state
    if (loading || !employerStats) {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 3,
                            height: "100%",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                    >
                        <Skeleton variant="text" width="40%" height={40} />
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            {[...Array(4)].map((_, index) => (
                                <Grid item xs={6} sm={3} key={index}>
                                    <Box sx={{ textAlign: "center", p: 1 }}>
                                        <Skeleton
                                            variant="text"
                                            height={40}
                                            width="70%"
                                            sx={{ mx: "auto" }}
                                        />
                                        <Skeleton
                                            variant="text"
                                            height={20}
                                            width="90%"
                                            sx={{ mx: "auto" }}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Skeleton
                                variant="rectangular"
                                height={60}
                                sx={{ mt: 2 }}
                            />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            height: "100%",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                    >
                        <Skeleton variant="text" width="60%" height={40} />
                        {[...Array(3)].map((_, index) => (
                            <Box key={index} sx={{ mb: 3, mt: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                    }}
                                >
                                    <Skeleton variant="text" width="40%" />
                                    <Skeleton variant="text" width="20%" />
                                </Box>
                                <Skeleton
                                    variant="rectangular"
                                    height={8}
                                    sx={{ borderRadius: 4 }}
                                />
                            </Box>
                        ))}
                        <Skeleton
                            variant="rectangular"
                            height={40}
                            sx={{ mt: 2, borderRadius: 1 }}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                    >
                        <Skeleton variant="text" width="30%" height={40} />
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            {[...Array(4)].map((_, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            bgcolor: "background.default",
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Box sx={{ p: 3, textAlign: "center" }}>
                                            <Skeleton
                                                variant="circular"
                                                width={60}
                                                height={60}
                                                sx={{ mx: "auto", mb: 2 }}
                                            />
                                            <Skeleton
                                                variant="text"
                                                height={30}
                                                width="50%"
                                                sx={{ mx: "auto" }}
                                            />
                                            <Skeleton
                                                variant="text"
                                                height={20}
                                                width="80%"
                                                sx={{ mx: "auto" }}
                                            />
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Skeleton variant="text" width="30%" height={40} />
                            <Skeleton
                                variant="rectangular"
                                width={150}
                                height={40}
                                sx={{ borderRadius: 1 }}
                            />
                        </Box>
                        <Skeleton variant="rectangular" height={200} />
                    </Paper>
                </Grid>
            </Grid>
        );
    }

    // Calculate reusable values
    const acceptedApplicationsCount =
        employerStats?.applications?.filter((a) => a.status === "accepte")
            ?.length || 0;

    const recentPostsCount =
        employerStats?.my_posts?.filter(
            (p) =>
                new Date(p.uploaded_at) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        )?.length || 0;

    // Calculate average salary once
    const averageSalary =
        employerStats?.my_posts && employerStats.my_posts.length > 0
            ? Math.round(
                  employerStats.my_posts.reduce(
                      (sum: number, post) => sum + Number(post.salaire || 0),
                      0
                  ) / employerStats.my_posts.length
              )
            : 0;

    // Function to handle viewing job applicants
    const handleViewJobApplicants = (jobId: number) => {
        if (employerStats && employerStats.applications) {
            // Filter applications that match the selected job's post_id
            const filteredApplicants = employerStats.applications.filter(
                (app) => app.post_id === jobId
            );

            // Find the job title
            const job = employerStats.my_posts.find((job) => job.id === jobId);

            // Set the data for the JobApplicantsView component
            setSelectedJobApplicants(filteredApplicants);
            setSelectedJobTitle(job?.title || "Unknown Job");
            setJobApplicantsOpen(true);

            // Close the menu
            handleMenuClose();
        }
    };

    const handleCloseJobApplicants = () => {
        setJobApplicantsOpen(false);
    };

    return (
        <>
            {/* Stats Overview Cards */}
            <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 3,
                        height: "100%",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Recruitment Overview
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={6} sm={3}>
                            <Box
                                sx={{
                                    textAlign: "center",
                                    p: 1,
                                }}
                            >
                                <Typography variant="h4" color="primary.main">
                                    {employerStats?.total_posts || 0}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Job Posts
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <Box
                                sx={{
                                    textAlign: "center",
                                    p: 1,
                                }}
                            >
                                <Typography variant="h4" color="primary.main">
                                    {employerStats?.total_applications || 0}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Applicants
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <Box
                                sx={{
                                    textAlign: "center",
                                    p: 1,
                                }}
                            >
                                <Typography variant="h4" color="warning.main">
                                    {employerStats?.pending_applications || 0}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Pending Review
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <Box
                                sx={{
                                    textAlign: "center",
                                    p: 1,
                                }}
                            >
                                <Typography variant="h4" color="success.main">
                                    {acceptedApplicationsCount}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Accepted
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                        <Divider />
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={4}>
                                <Badge
                                    badgeContent={
                                        employerStats?.pending_applications || 0
                                    }
                                    color="warning"
                                    max={999}
                                >
                                    <Chip
                                        icon={<AssignmentInd />}
                                        label="Pending"
                                        variant="outlined"
                                    />
                                </Badge>
                            </Grid>
                            <Grid item xs={4}>
                                <Badge
                                    badgeContent={acceptedApplicationsCount}
                                    color="success"
                                    max={999}
                                >
                                    <Chip
                                        icon={<CheckCircle />}
                                        label="Accepted"
                                        variant="outlined"
                                    />
                                </Badge>
                            </Grid>
                            <Grid item xs={4}>
                                <Badge
                                    badgeContent={recentPostsCount}
                                    color="primary"
                                    max={999}
                                >
                                    <Chip
                                        icon={<Schedule />}
                                        label="Recent Posts"
                                        variant="outlined"
                                    />
                                </Badge>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>

            {/* Activity Stats */}
            <Grid item xs={12} md={4}>
                <Paper
                    sx={{
                        p: 3,
                        // height: "100%",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Recruitment Progress
                    </Typography>

                    <Box sx={{ mb: 3, mt: 2 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2">
                                Application Rate
                            </Typography>
                            <Typography variant="body2">
                                {(() => {
                                    const totalPosts = Math.max(
                                        employerStats?.total_posts || 0,
                                        1
                                    );
                                    const totalApps =
                                        employerStats?.total_applications || 0;
                                    return `${Math.min(
                                        100,
                                        Math.round(
                                            (totalApps / totalPosts) * 100
                                        )
                                    )}%`;
                                })()}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={(() => {
                                const totalPosts = Math.max(
                                    employerStats?.total_posts || 0,
                                    1
                                );
                                const totalApps =
                                    employerStats?.total_applications || 0;
                                return Math.min(
                                    100,
                                    (totalApps / totalPosts) * 100
                                );
                            })()}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                            }}
                            color="primary"
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2">
                                Review Progress
                            </Typography>
                            <Typography variant="body2">
                                {(() => {
                                    const totalApps = Math.max(
                                        employerStats?.total_applications || 0,
                                        1
                                    );
                                    const pendingApps =
                                        employerStats?.pending_applications ||
                                        0;
                                    return `${Math.round(
                                        100 - (pendingApps / totalApps) * 100
                                    )}%`;
                                })()}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={(() => {
                                const totalApps = Math.max(
                                    employerStats?.total_applications || 0,
                                    1
                                );
                                const pendingApps =
                                    employerStats?.pending_applications || 0;
                                return 100 - (pendingApps / totalApps) * 100;
                            })()}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                            }}
                            color="warning"
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2">
                                Acceptance Rate
                            </Typography>
                            <Typography variant="body2">
                                {(() => {
                                    const totalApps = Math.max(
                                        employerStats?.total_applications || 0,
                                        1
                                    );
                                    return `${Math.round(
                                        (acceptedApplicationsCount /
                                            totalApps) *
                                            100
                                    )}%`;
                                })()}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={(() => {
                                const totalApps = Math.max(
                                    employerStats?.total_applications || 0,
                                    1
                                );
                                return (
                                    (acceptedApplicationsCount / totalApps) *
                                    100
                                );
                            })()}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                            }}
                            color="success"
                        />
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => setActiveTab("applicants")}
                        fullWidth
                        sx={{ mt: 1 }}
                    >
                        View All Applicants
                    </Button>
                </Paper>
            </Grid>

            {/* Recent Applicants */}
            <Grid item xs={12} md={8}>
                <Paper
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        mb: 3,
                        height: "100%",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        component="h2"
                        variant="h6"
                        color="primary"
                        gutterBottom
                        sx={{ px: 1, pt: 1 }}
                    >
                        Recent Applicants
                    </Typography>

                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                p: 2,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : employerStats?.applications &&
                      employerStats.applications.length > 0 ? (
                        <Box sx={{ overflow: "hidden", flexGrow: 1 }}>
                            {employerStats.applications
                                .slice(0, 5)
                                .map((applicant, i) => (
                                    <>
                                        {i !== 0 && (
                                            <Divider
                                                sx={{
                                                    my: 1,
                                                    borderColor: "divider",
                                                }}
                                            />
                                        )}
                                        <Box
                                            key={applicant.id}
                                            sx={{
                                                mb: 1.5,
                                                backgroundColor:
                                                    "background.paper",
                                                borderRadius: 2,
                                                p: 1.5,
                                                transition: "all 0.2s",
                                                "&:hover": {
                                                    backgroundColor:
                                                        "action.hover",
                                                    transform:
                                                        "translateY(-2px)",
                                                    boxShadow:
                                                        "0 4px 10px rgba(0,0,0,0.08)",
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "flex-start",
                                                    mb: 1,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1.5,
                                                        flexGrow: 1,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            bgcolor:
                                                                applicant.status ===
                                                                "accepte"
                                                                    ? "success.light"
                                                                    : applicant.status ===
                                                                      "refuse"
                                                                    ? "error.light"
                                                                    : "warning.light",
                                                            width: 36,
                                                            height: 36,
                                                        }}
                                                    >
                                                        {applicant.applicant_email
                                                            .substring(0, 1)
                                                            .toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight={500}
                                                            noWrap
                                                            sx={{
                                                                maxWidth: {
                                                                    xs: "150px",
                                                                    sm: "200px",
                                                                    md: "150px",
                                                                    lg: "200px",
                                                                },
                                                            }}
                                                        >
                                                            {
                                                                applicant.applicant_email
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            noWrap
                                                            sx={{
                                                                maxWidth: {
                                                                    xs: "150px",
                                                                    sm: "200px",
                                                                    md: "150px",
                                                                    lg: "200px",
                                                                },
                                                                display:
                                                                    "block",
                                                            }}
                                                        >
                                                            {
                                                                applicant.post_title
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Chip
                                                    label={
                                                        applicant.status ===
                                                        "accepte"
                                                            ? "Accepted"
                                                            : applicant.status ===
                                                              "refuse"
                                                            ? "Rejected"
                                                            : "Pending"
                                                    }
                                                    size="small"
                                                    color={
                                                        applicant.status ===
                                                        "accepte"
                                                            ? "success"
                                                            : applicant.status ===
                                                              "refuse"
                                                            ? "error"
                                                            : "warning"
                                                    }
                                                    sx={{
                                                        minWidth: 70,
                                                        justifyContent:
                                                            "center",
                                                        fontSize: "0.7rem",
                                                        height: 24,
                                                        color: "#fff",
                                                    }}
                                                />
                                            </Box>

                                            <Box
                                                sx={{
                                                    mt: 0.5,
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Box>
                                                    {applicant.test &&
                                                        applicant.test?.score !=
                                                            undefined && (
                                                            <Chip
                                                                label={`Score: ${applicant.test.score}%`}
                                                                size="small"
                                                                color="primary"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize:
                                                                        "0.65rem",
                                                                }}
                                                            />
                                                        )}
                                                    {applicant.interview_id !=
                                                        null &&
                                                        applicant.test?.score ==
                                                            undefined && (
                                                            <Chip
                                                                icon={
                                                                    <Schedule
                                                                        sx={{
                                                                            fontSize: 12,
                                                                        }}
                                                                    />
                                                                }
                                                                label="Interview scheduled"
                                                                size="small"
                                                                color="primary"
                                                                sx={{
                                                                    py: 1.4,
                                                                    height: 20,
                                                                    fontSize:
                                                                        "0.65rem",
                                                                }}
                                                            />
                                                        )}
                                                </Box>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        fontSize: "0.7rem",
                                                    }}
                                                >
                                                    {formatDate(
                                                        applicant.application_date
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </>
                                ))}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 4,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                flexGrow: 1,
                            }}
                        >
                            <PersonOutline
                                sx={{
                                    fontSize: 40,
                                    color: "text.disabled",
                                    mb: 1,
                                }}
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight={500}
                            >
                                No applications received yet
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.disabled"
                                sx={{ maxWidth: "80%", mt: 0.5 }}
                            >
                                Applications will appear here when candidates
                                apply to your job postings
                            </Typography>
                        </Box>
                    )}

                    {employerStats?.applications &&
                        employerStats.applications.length > 0 && (
                            <Button
                                size="small"
                                endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                                sx={{
                                    mt: "auto",
                                    pt: 1,
                                    alignSelf: "flex-end",
                                }}
                                onClick={handleViewApplicants}
                            >
                                View all applicants
                            </Button>
                        )}
                </Paper>
            </Grid>

            {/* Platform Activity */}
            <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Recruitment Activity
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                elevation={0}
                                sx={{
                                    bgcolor: "background.default",
                                    borderRadius: 2,
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <WorkOutline
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        {employerStats?.total_posts || 0}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Active Job Posts
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                elevation={0}
                                sx={{
                                    bgcolor: "background.default",
                                    borderRadius: 2,
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <PersonOutline
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        {employerStats?.total_applications || 0}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Total Applicants
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                elevation={0}
                                sx={{
                                    bgcolor: "background.default",
                                    borderRadius: 2,
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <BusinessCenter
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        {acceptedApplicationsCount}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Positions Filled
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                elevation={0}
                                sx={{
                                    bgcolor: "background.default",
                                    borderRadius: 2,
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <TrendingUp
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        ${averageSalary}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Average Salary
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* Job Postings List */}
            <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                        >
                            Your Job Postings
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<Add />}
                            onClick={handleCreateJob}
                        >
                            Post New Job
                        </Button>
                    </Box>

                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                p: 3,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : employerStats?.my_posts &&
                      employerStats.my_posts.length > 0 ? (
                        <TableContainer>
                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Job Title</TableCell>
                                        <TableCell>Salary</TableCell>
                                        <TableCell>Posted Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employerStats.my_posts.map((job) => (
                                        <TableRow key={job.id}>
                                            <TableCell>{job.title}</TableCell>
                                            <TableCell>{job.salaire}</TableCell>
                                            <TableCell>
                                                {formatDate(job.uploaded_at)}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={(event) =>
                                                        handleMenuClick(
                                                            event,
                                                            job.id
                                                        )
                                                    }
                                                >
                                                    <MoreVert fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 3,
                            }}
                        >
                            <Typography variant="body1">
                                No job postings found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create your first job posting to start receiving
                                applications
                            </Typography>
                        </Box>
                    )}

                    <Menu
                        id="job-actions-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem
                            onClick={() =>
                                selectedJobId &&
                                handleViewJobApplicants(selectedJobId)
                            }
                        >
                            View Applicants
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                selectedJobId && handleCloseJob(selectedJobId)
                            }
                        >
                            Close Posting
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                selectedJobId && handleDeleteJob(selectedJobId)
                            }
                        >
                            Delete
                        </MenuItem>
                    </Menu>
                </Paper>
            </Grid>

            {/* Job Applicants Dialog */}
            <JobApplicantsView
                applications={selectedJobApplicants}
                jobTitle={selectedJobTitle}
                loading={loading}
                error={error}
                open={jobApplicantsOpen}
                onClose={handleCloseJobApplicants}
            />
        </>
    );
};

export default EmployerOverview;
