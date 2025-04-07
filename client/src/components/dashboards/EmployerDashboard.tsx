import { useState, Fragment, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    List,
    ListItem,
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
    Theme,
    Card,
    CardContent,
    Avatar,
    CircularProgress,
    Alert,
    Badge,
    LinearProgress,
} from "@mui/material";
import {
    MoreVert,
    Add,
    EditOutlined,
    WorkOutline,
    BusinessCenter,
    PersonOutline,
    CheckCircle,
    AssignmentInd,
    Schedule,
    TrendingUp,
    Visibility,
} from "@mui/icons-material";
import { useNotification } from "../notifications/SlideInNotifications";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboard } from "../../contexts/DashboardContext";
import EmployerProfileDialog from "../profile/EmployerProfileDialog";
import ChangePasswordDialog from "../profile/ChangePasswordDialog ";
import DeleteAccountDialog from "../profile/DeleteAccountDialog ";
import { format } from "date-fns";
import CreateJobDialog from "../jobs/CreateJobDialog";
import UpdateJobDialog from "../jobs/UpdateJobDialog";
import { useJobPost } from "../../contexts/JobPostContext";
import JobView from "../jobs/JobView";
import { JobPost } from "../../types/Job.types";

const EmployerDashboard = ({ theme }: { theme: Theme }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [viewedJob, setViewedJob] = useState<JobPost | null>(null);
    const { pushNotification } = useNotification();
    const { user } = useAuth();
    const { employerStats, loading, error, fetchEmployerStats } =
        useDashboard();

    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
    const [createJobDialogOpen, setCreateJobDialogOpen] = useState(false);
    const [updateJobDialogOpen, setUpdateJobDialogOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [jobViewOpen, setJobViewOpen] = useState(false);
    const { updateJob, deleteJob } = useJobPost();

    useEffect(() => {
        fetchEmployerStats();
    }, []);

    const handleMenuClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        id: number
    ) => {
        setAnchorEl(event.currentTarget);
        setSelectedJobId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        // setSelectedJobId(null);
    };

    const handleCreateJob = () => {
        setCreateJobDialogOpen(true);
    };

    const handleViewApplicants = () => {
        pushNotification("Viewing all applicants feature coming soon!", "info");
    };

    const handleEditProfileOpen = () => setEditProfileOpen(true);
    const handleEditProfileClose = () => setEditProfileOpen(false);

    const handleChangePasswordOpen = () => setChangePasswordOpen(true);
    const handleChangePasswordClose = () => setChangePasswordOpen(false);

    const handleDeleteAccountOpen = () => setDeleteAccountOpen(true);
    const handleDeleteAccountClose = () => setDeleteAccountOpen(false);

    const handleEditJob = (jobId: number) => {
        setSelectedJobId(jobId);
        setUpdateJobDialogOpen(true);
        handleMenuClose();
    };

    const handleCloseJob = async (jobId: number) => {
        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const formattedDate = yesterday.toISOString().split("T")[0]; // Format as YYYY-MM-DD

            await updateJob(jobId, {
                final_date: formattedDate,
            });
            pushNotification("Job offer has been closed", "success");

            fetchEmployerStats();
        } catch (error) {
            console.error("Failed to close job:", error);
        }
        handleMenuClose();
    };

    const handleDeleteJob = async (jobId: number) => {
        try {
            await deleteJob(jobId);
            fetchEmployerStats();
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
        handleMenuClose();
    };

    const handleCreateJobDialogClose = (): void => {
        setCreateJobDialogOpen(false);
    };

    const handleUpdateJobDialogClose = () => {
        setUpdateJobDialogOpen(false);
    };

    const handleViewJob = (jobId: number) => {
        setSelectedJobId(jobId);
        setJobViewOpen(true);
        console.log("herrre ", jobId);

        handleMenuClose();
    };

    // Format date function
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch (error) {
            return "Invalid date";
        }
    };

    // Get company information from user data
    const companyName = user?.company_name || "undefined";
    const companyAddress = user?.company_address || "undefined";
    const companyWebsite = user?.company_website || "undefined";

    const displayName = user ? `${user.first_name} ${user.last_name}` : "User";

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
                      (sum, post) => sum + Number(post.salaire || 0),
                      0
                  ) / employerStats.my_posts.length
              )
            : 0;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 3,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                mr: {
                                    xs: 2,
                                    sm: 3,
                                },
                                bgcolor: "primary.main",
                            }}
                            alt={displayName}
                            src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=random&format=svg`}
                        >
                            {user?.first_name?.[0]}
                            {user?.last_name?.[0]}
                        </Avatar>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                },
                                justifyContent: "space-between",
                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },
                                flexGrow: 1,
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h5"
                                    component="h1"
                                    gutterBottom
                                >
                                    Welcome back, {companyName}
                                </Typography>
                                {companyAddress && (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {companyAddress}
                                    </Typography>
                                )}
                                {companyWebsite && (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}
                                    >
                                        {companyWebsite}
                                    </Typography>
                                )}
                            </Box>
                            <Button
                                variant="outlined"
                                startIcon={<EditOutlined />}
                                onClick={handleEditProfileOpen}
                                color="primary"
                                sx={{
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Dashboard Navigation */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            mb: 2,
                            display: "flex",
                            overflow: "auto",
                        }}
                    >
                        <Button
                            onClick={() => setActiveTab("overview")}
                            sx={{
                                mr: 2,
                                color:
                                    activeTab === "overview"
                                        ? "primary.main"
                                        : "text.primary",
                                borderBottom:
                                    activeTab === "overview"
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : "none",
                                borderRadius: 0,
                                pb: 1,
                            }}
                        >
                            Overview
                        </Button>
                        <Button
                            onClick={() => setActiveTab("applicants")}
                            sx={{
                                mr: 2,
                                color:
                                    activeTab === "applicants"
                                        ? "primary.main"
                                        : "text.primary",
                                borderBottom:
                                    activeTab === "applicants"
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : "none",
                                borderRadius: 0,
                                pb: 1,
                            }}
                        >
                            Applicants
                        </Button>
                        <Button
                            onClick={() => setActiveTab("analytics")}
                            sx={{
                                mr: 2,
                                color:
                                    activeTab === "analytics"
                                        ? "primary.main"
                                        : "text.primary",
                                borderBottom:
                                    activeTab === "analytics"
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : "none",
                                borderRadius: 0,
                                pb: 1,
                            }}
                        >
                            Analytics
                        </Button>
                        <Button
                            onClick={() => setActiveTab("profile")}
                            sx={{
                                mr: 2,
                                color:
                                    activeTab === "profile"
                                        ? "primary.main"
                                        : "text.primary",
                                borderBottom:
                                    activeTab === "profile"
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : "none",
                                borderRadius: 0,
                                pb: 1,
                            }}
                        >
                            Profile
                        </Button>
                    </Box>
                </Grid>

                {activeTab === "overview" && (
                    <>
                        {/* Stats Overview Cards */}
                        <Grid item xs={12} md={8}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: "100%",
                                    borderRadius: 2,
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
                                            <Typography
                                                variant="h4"
                                                color="primary.main"
                                            >
                                                {employerStats?.total_posts ||
                                                    0}
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
                                            <Typography
                                                variant="h4"
                                                color="primary.main"
                                            >
                                                {employerStats?.total_applications ||
                                                    0}
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
                                            <Typography
                                                variant="h4"
                                                color="warning.main"
                                            >
                                                {employerStats?.pending_applications ||
                                                    0}
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
                                            <Typography
                                                variant="h4"
                                                color="success.main"
                                            >
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
                                                    employerStats?.pending_applications ||
                                                    0
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
                                                badgeContent={
                                                    acceptedApplicationsCount
                                                }
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
                                    height: "100%",
                                    borderRadius: 2,
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
                                                    employerStats?.total_posts ||
                                                        0,
                                                    1
                                                );
                                                const totalApps =
                                                    employerStats?.total_applications ||
                                                    0;
                                                return `${Math.min(
                                                    100,
                                                    Math.round(
                                                        (totalApps /
                                                            totalPosts) *
                                                            100
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
                                                employerStats?.total_applications ||
                                                0;
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
                                                    employerStats?.total_applications ||
                                                        0,
                                                    1
                                                );
                                                const pendingApps =
                                                    employerStats?.pending_applications ||
                                                    0;
                                                return `${Math.round(
                                                    100 -
                                                        (pendingApps /
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
                                                employerStats?.total_applications ||
                                                    0,
                                                1
                                            );
                                            const pendingApps =
                                                employerStats?.pending_applications ||
                                                0;
                                            return (
                                                100 -
                                                (pendingApps / totalApps) * 100
                                            );
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
                                                    employerStats?.total_applications ||
                                                        0,
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
                                                employerStats?.total_applications ||
                                                    0,
                                                1
                                            );
                                            return (
                                                (acceptedApplicationsCount /
                                                    totalApps) *
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

                        {/* Platform Activity */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
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
                                            <CardContent
                                                sx={{ textAlign: "center" }}
                                            >
                                                <WorkOutline
                                                    color="primary"
                                                    sx={{ fontSize: 40, mb: 1 }}
                                                />
                                                <Typography variant="h6">
                                                    {employerStats?.total_posts ||
                                                        0}
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
                                            <CardContent
                                                sx={{ textAlign: "center" }}
                                            >
                                                <PersonOutline
                                                    color="primary"
                                                    sx={{ fontSize: 40, mb: 1 }}
                                                />
                                                <Typography variant="h6">
                                                    {employerStats?.total_applications ||
                                                        0}
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
                                            <CardContent
                                                sx={{ textAlign: "center" }}
                                            >
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
                                            <CardContent
                                                sx={{ textAlign: "center" }}
                                            >
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
                                                    <TableCell>
                                                        Job Title
                                                    </TableCell>
                                                    <TableCell>
                                                        Salary
                                                    </TableCell>
                                                    <TableCell>
                                                        Posted Date
                                                    </TableCell>
                                                    <TableCell>
                                                        Actions
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {employerStats.my_posts.map(
                                                    (job) => (
                                                        <TableRow key={job.id}>
                                                            <TableCell>
                                                                {job.title}
                                                            </TableCell>
                                                            <TableCell>
                                                                {job.salaire}
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatDate(
                                                                    job.uploaded_at
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(
                                                                        event
                                                                    ) =>
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
                                                    )
                                                )}
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
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Create your first job posting to
                                            start receiving applications
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
                                            handleViewJob(selectedJobId)
                                        }
                                    >
                                        View Details
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose}>
                                        View Applicants
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            selectedJobId &&
                                            handleCloseJob(selectedJobId)
                                        }
                                    >
                                        Close Posting
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            selectedJobId &&
                                            handleDeleteJob(selectedJobId)
                                        }
                                    >
                                        Delete
                                    </MenuItem>
                                </Menu>
                            </Paper>
                        </Grid>

                        {/* Sidebar */}
                        <Grid item xs={12} md={4}>
                            {/* Recent Applicants */}
                            <Paper
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    component="h2"
                                    variant="h6"
                                    color="primary"
                                    gutterBottom
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
                                    <List dense>
                                        {employerStats.applications
                                            .slice(0, 5)
                                            .map((applicant) => (
                                                <Fragment key={applicant.id}>
                                                    <ListItem>
                                                        <Box
                                                            sx={{
                                                                width: "100%",
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    mb: 0.5,
                                                                }}
                                                            >
                                                                <Typography variant="body1">
                                                                    {
                                                                        applicant.applicant_email.split(
                                                                            "@"
                                                                        )[0]
                                                                    }
                                                                </Typography>
                                                                <Chip
                                                                    label={`${
                                                                        applicant.status ===
                                                                        "accepte"
                                                                            ? "Accepted"
                                                                            : "Pending"
                                                                    }`}
                                                                    size="small"
                                                                    color={
                                                                        applicant.status ===
                                                                        "accepte"
                                                                            ? "success"
                                                                            : "warning"
                                                                    }
                                                                />
                                                            </Box>
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    alignItems:
                                                                        "center",
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {
                                                                        applicant.post_title
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    {formatDate(
                                                                        applicant.application_date
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </ListItem>
                                                    <Divider component="li" />
                                                </Fragment>
                                            ))}
                                    </List>
                                ) : (
                                    <Box sx={{ textAlign: "center", py: 2 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            No applications received yet
                                        </Typography>
                                    </Box>
                                )}
                                <Button
                                    size="small"
                                    sx={{ mt: 1, alignSelf: "flex-end" }}
                                    onClick={handleViewApplicants}
                                >
                                    View all applicants
                                </Button>
                            </Paper>
                        </Grid>
                    </>
                )}

                {activeTab === "applicants" && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography
                                variant="h6"
                                component="h2"
                                gutterBottom
                            >
                                Applicant Management
                            </Typography>

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
                            ) : employerStats?.applications &&
                              employerStats.applications.length > 0 ? (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Applicant</TableCell>
                                                <TableCell>
                                                    Job Position
                                                </TableCell>
                                                <TableCell>
                                                    Application Date
                                                </TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {employerStats.applications.map(
                                                (app) => (
                                                    <TableRow key={app.id}>
                                                        <TableCell>
                                                            {
                                                                app.applicant_email
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {app.post_title}
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatDate(
                                                                app.application_date
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={
                                                                    app.status ===
                                                                    "accepte"
                                                                        ? "Accepted"
                                                                        : "Pending"
                                                                }
                                                                color={
                                                                    app.status ===
                                                                    "accepte"
                                                                        ? "success"
                                                                        : "warning"
                                                                }
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() =>
                                                                    pushNotification(
                                                                        "Viewing CV feature coming soon!",
                                                                        "info"
                                                                    )
                                                                }
                                                            >
                                                                View CV
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box sx={{ textAlign: "center", py: 3 }}>
                                    <Typography variant="body1">
                                        No applicants found
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Applications will appear here when
                                        candidates apply to your job postings
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                )}

                {activeTab === "analytics" && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography
                                variant="h6"
                                component="h2"
                                gutterBottom
                            >
                                Recruitment Analytics
                            </Typography>

                            {/* Add analytics UI here */}
                            <Typography variant="body1">
                                Detailed analytics content would go here...
                            </Typography>
                        </Paper>
                    </Grid>
                )}

                {activeTab === "profile" && (
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 0,
                                overflow: "hidden",
                                borderRadius: 2,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            }}
                        >
                            {/* Profile Header */}
                            <Box
                                sx={{
                                    p: 4,
                                    bgcolor: "primary.main",
                                    color: "white",
                                    backgroundImage:
                                        "linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)",
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight="500"
                                    gutterBottom
                                >
                                    Company Profile
                                </Typography>
                                <Typography variant="body2">
                                    Manage your company information and account
                                    settings
                                </Typography>
                            </Box>

                            {/* Profile Content */}
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                height: "100%",
                                                p: 2,
                                                border: 1,
                                                borderColor: "divider",
                                                borderRadius: 2,
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    boxShadow:
                                                        "0 4px 8px rgba(0,0,0,0.1)",
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    mb: 3,
                                                    pb: 2,
                                                    borderBottom: 1,
                                                    borderColor: "divider",
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 60,
                                                        height: 60,
                                                        mr: 2,
                                                        bgcolor: "primary.main",
                                                    }}
                                                    alt={companyName}
                                                    src={`https://ui-avatars.com/api/?name=${companyName}&background=random`}
                                                >
                                                    {companyName?.[0]}
                                                </Avatar>
                                                <Box>
                                                    <Typography
                                                        variant="h6"
                                                        component="div"
                                                    >
                                                        Company Information
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Your company profile
                                                        details
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ mb: 3 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                >
                                                    Company Name
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="medium"
                                                >
                                                    {companyName}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 3 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                >
                                                    Company Address
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="medium"
                                                >
                                                    {companyAddress ||
                                                        "Not specified"}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 3 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                >
                                                    Website
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="medium"
                                                >
                                                    {companyWebsite ||
                                                        "Not specified"}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 3 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                >
                                                    Account Email
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="medium"
                                                >
                                                    {user?.email ||
                                                        "Not available"}
                                                </Typography>
                                            </Box>

                                            <Button
                                                variant="contained"
                                                size="medium"
                                                sx={{ mt: 1 }}
                                                onClick={handleEditProfileOpen}
                                                fullWidth
                                            >
                                                Edit Company Information
                                            </Button>
                                        </Card>
                                    </Grid>

                                    {/* Account settings card */}
                                    <Grid item xs={12} md={6}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                height: "100%",
                                                p: 2,
                                                border: 1,
                                                borderColor: "divider",
                                                borderRadius: 2,
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    boxShadow:
                                                        "0 4px 8px rgba(0,0,0,0.1)",
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    mb: 3,
                                                    pb: 2,
                                                    borderBottom: 1,
                                                    borderColor: "divider",
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    component="div"
                                                >
                                                    Account Settings
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Manage your account security
                                                </Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    p: 3,
                                                    mb: 2,
                                                    borderRadius: 2,
                                                    bgcolor: "action.hover",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        mb: 2,
                                                        flexDirection: {
                                                            xs: "column",
                                                            sm: "row",
                                                        },
                                                        justifyContent:
                                                            "center",
                                                        width: "100%",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        size="medium"
                                                        onClick={
                                                            handleChangePasswordOpen
                                                        }
                                                        sx={{
                                                            whiteSpace:
                                                                "nowrap",
                                                            minWidth: {
                                                                xs: "100%",
                                                                sm: "auto",
                                                            },
                                                        }}
                                                    >
                                                        Change Password
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        size="medium"
                                                        color="error"
                                                        onClick={
                                                            handleDeleteAccountOpen
                                                        }
                                                        sx={{
                                                            whiteSpace:
                                                                "nowrap",
                                                            minWidth: {
                                                                xs: "100%",
                                                                sm: "auto",
                                                            },
                                                        }}
                                                    >
                                                        Delete Account
                                                    </Button>
                                                </Box>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    align="center"
                                                >
                                                    Changing your password
                                                    regularly helps keep your
                                                    account secure
                                                </Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    p: 3,
                                                    borderRadius: 2,
                                                    bgcolor:
                                                        "background.default",
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle2"
                                                    gutterBottom
                                                >
                                                    Account Representative
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        mt: 1,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            mr: 2,
                                                        }}
                                                        alt={`${user?.first_name} ${user?.last_name}`}
                                                    >
                                                        {user?.first_name?.[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1">{`${
                                                            user?.first_name ||
                                                            ""
                                                        } ${
                                                            user?.last_name ||
                                                            ""
                                                        }`}</Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Primary Contact
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Grid>
            {/* Dialogs */}
            {editProfileOpen && (
                <EmployerProfileDialog
                    open={editProfileOpen}
                    onClose={handleEditProfileClose}
                />
            )}
            {changePasswordOpen && (
                <ChangePasswordDialog
                    open={changePasswordOpen}
                    onClose={handleChangePasswordClose}
                />
            )}
            {deleteAccountOpen && (
                <DeleteAccountDialog
                    open={deleteAccountOpen}
                    onClose={handleDeleteAccountClose}
                />
            )}
            {createJobDialogOpen && (
                <CreateJobDialog
                    open={createJobDialogOpen}
                    onClose={handleCreateJobDialogClose}
                />
            )}
            {updateJobDialogOpen && selectedJobId && (
                <UpdateJobDialog
                    open={updateJobDialogOpen}
                    onClose={handleUpdateJobDialogClose}
                    jobId={selectedJobId}
                    job={viewedJob}
                />
            )}
            {jobViewOpen && selectedJobId && (
                <JobView
                    open={jobViewOpen}
                    onClose={() => setJobViewOpen(false)}
                    jobId={selectedJobId}
                    onEdit={handleEditJob}
                    setViewedJob={setViewedJob}
                />
            )}
        </Container>
    );
};

export default EmployerDashboard;
