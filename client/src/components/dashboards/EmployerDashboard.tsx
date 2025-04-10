import { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    Avatar,
    CircularProgress,
    Alert,
    Chip,
    Tabs,
    Tab,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import {
    EditOutlined,
    Dashboard,
    Group,
    AccountCircle,
    WorkOutline,
    Visibility,
    Edit,
    Delete,
    ThumbUp,
    ThumbDown,
    School,
    Schedule,
    HourglassEmpty,
    PersonOutline,
    Add,
} from "@mui/icons-material";
import { useNotification } from "../notifications/SlideInNotifications";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboard } from "../../contexts/DashboardContext";
import EmployerProfileDialog from "../profile/EmployerProfileDialog";
import ChangePasswordDialog from "../profile/ChangePasswordDialog";
import DeleteAccountDialog from "../profile/DeleteAccountDialog";
import CreateJobDialog from "../jobs/CreateJobDialog";
import UpdateJobDialog from "../jobs/UpdateJobDialog";
import { useJobPost } from "../../contexts/JobPostContext";
import JobView from "../jobs/JobView";
import { JobPost } from "../../types/Job.types";
import EmployerOverview from "./employer/OverView";
import { formatDate } from "../../services/utils";

const EmployerDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [viewedJob, setViewedJob] = useState<JobPost | null>(null);
    const { pushNotification } = useNotification();
    const { user } = useAuth();
    const {
        employerStats,
        loading,
        error,
        fetchEmployerStats,
        updateApplicationStatus,
    } = useDashboard();

    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
    const [createJobDialogOpen, setCreateJobDialogOpen] = useState(false);
    const [updateJobDialogOpen, setUpdateJobDialogOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [jobViewOpen, setJobViewOpen] = useState(false);
    const { updateJob, deleteJob } = useJobPost();

    // Status update confirmation dialog
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<{
        id: number;
        status: "accepte" | "refuse";
        interviewId?: number;
    } | null>(null);

    useEffect(() => {
        fetchEmployerStats();
    }, []);

    const handleTabChange = (newValue: number) => {
        setTabValue(newValue);
    };

    const handleMenuClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        id: number
    ) => {
        setAnchorEl(event.currentTarget);
        setSelectedJobId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCreateJob = () => {
        setCreateJobDialogOpen(true);
    };

    const handleViewApplicants = () => {
        setTabValue(1); // Switch to applicants tab
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
        } catch (error) {}
        handleMenuClose();
    };

    const handleDeleteJob = async (jobId: number) => {
        try {
            await deleteJob(jobId);
            fetchEmployerStats();
        } catch (error) {}
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
        handleMenuClose();
    };

    const handleUpdateApplicationStatus = (
        id: number,
        status: "accepte" | "refuse"
    ) => {
        setSelectedApplication({ id, status });
        setConfirmDialogOpen(true);
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
        setSelectedApplication(null);
    };

    const handleConfirmStatusUpdate = async () => {
        if (selectedApplication) {
            try {
                await updateApplicationStatus(
                    selectedApplication.id,
                    selectedApplication.status
                );
                pushNotification(
                    `Application status updated to ${selectedApplication.status}`,
                    "success"
                );
                fetchEmployerStats();
            } catch (error) {
                pushNotification(
                    "Failed to update application status",
                    "error"
                );
            }
        }
        handleConfirmDialogClose();
    };

    // Format date function

    // Get company information from user data
    const companyName = user?.company_name || "undefined";
    const companyAddress = user?.company_address || "undefined";
    const companyWebsite = user?.company_website || "undefined";

    const displayName = user ? `${user.first_name} ${user.last_name}` : "User";

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

                {/* Dashboard Navigation with Tabs */}
                <Grid item xs={12}>
                    <Box
                        sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
                    >
                        <Tabs
                            value={tabValue}
                            onChange={(_e, newValue) =>
                                handleTabChange(newValue)
                            }
                            aria-label="employer dashboard tabs"
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab
                                icon={<Dashboard />}
                                iconPosition="start"
                                label="Overview"
                            />
                            <Tab
                                icon={<Group />}
                                iconPosition="start"
                                label="Applicants"
                            />
                            <Tab
                                icon={<WorkOutline />}
                                iconPosition="start"
                                label="Jobs"
                            />
                            <Tab
                                icon={<AccountCircle />}
                                iconPosition="start"
                                label="Profile"
                            />
                        </Tabs>
                    </Box>
                </Grid>

                {/* Tab Content */}
                {tabValue === 0 && (
                    <EmployerOverview
                        employerStats={employerStats}
                        loading={loading}
                        error={error}
                        handleViewApplicants={handleViewApplicants}
                        handleCreateJob={handleCreateJob}
                        handleCloseJob={handleCloseJob}
                        handleDeleteJob={handleDeleteJob}
                        setActiveTab={(tab: string) => {
                            if (tab === "applicants") setTabValue(1);
                            else if (tab === "profile") setTabValue(4);
                        }}
                        selectedJobId={selectedJobId}
                        anchorEl={anchorEl}
                        handleMenuClick={handleMenuClick}
                        handleMenuClose={handleMenuClose}
                    />
                )}

                {tabValue === 1 && (
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderRadius: 2,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 3,
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: 2,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    gutterBottom={false}
                                >
                                    Applicant Management
                                </Typography>
                                <Box>
                                    <Chip
                                        icon={<Group sx={{ fontSize: 16 }} />}
                                        label={`${
                                            employerStats?.total_applications ||
                                            0
                                        } Total Applicants`}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            py: 0.8,
                                            px: 1.4,
                                        }}
                                    />
                                </Box>
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
                            ) : employerStats?.applications &&
                              employerStats.applications.length > 0 ? (
                                <Box
                                    sx={{
                                        width: "100%",
                                        overflow: "auto",
                                        "&::-webkit-scrollbar": {
                                            height: 8,
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: "rgba(0,0,0,0.1)",
                                            borderRadius: 4,
                                        },
                                    }}
                                >
                                    <Table sx={{ minWidth: 650 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Applicant</TableCell>
                                                <TableCell>
                                                    Job Position
                                                </TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="center">
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {employerStats.applications.map(
                                                (app) => {
                                                    // Determine if actions should be disabled
                                                    const isInterviewComplete =
                                                        app.test &&
                                                        app.test.score !== null;
                                                    const actionsDisabled =
                                                        !isInterviewComplete;

                                                    return (
                                                        <TableRow
                                                            key={app.id}
                                                            sx={{
                                                                "&:hover": {
                                                                    backgroundColor:
                                                                        "action.hover",
                                                                },
                                                            }}
                                                        >
                                                            <TableCell>
                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: 2,
                                                                    }}
                                                                >
                                                                    <Avatar
                                                                        sx={{
                                                                            width: 40,
                                                                            height: 40,
                                                                            bgcolor:
                                                                                app.status ===
                                                                                "accepte"
                                                                                    ? "success.light"
                                                                                    : "warning.light",
                                                                        }}
                                                                    >
                                                                        {app.applicant_email
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography
                                                                            variant="body1"
                                                                            fontWeight={
                                                                                500
                                                                            }
                                                                        >
                                                                            {
                                                                                app.applicant_email
                                                                            }
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="caption"
                                                                            color="text.secondary"
                                                                        >
                                                                            Applied
                                                                            on{" "}
                                                                            {formatDate(
                                                                                app.application_date,
                                                                                true
                                                                            )}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight={
                                                                        500
                                                                    }
                                                                >
                                                                    {
                                                                        app.post_title
                                                                    }
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                        flexDirection:
                                                                            "column",
                                                                        gap: 1,
                                                                    }}
                                                                >
                                                                    <Chip
                                                                        label={
                                                                            app.status ===
                                                                            "accepte"
                                                                                ? "Accepted"
                                                                                : app.status ===
                                                                                  "refuse"
                                                                                ? "Rejected"
                                                                                : "Pending"
                                                                        }
                                                                        color={
                                                                            app.status ===
                                                                            "accepte"
                                                                                ? "success"
                                                                                : app.status ===
                                                                                  "refuse"
                                                                                ? "error"
                                                                                : "warning"
                                                                        }
                                                                        size="small"
                                                                        sx={{
                                                                            fontWeight: 500,
                                                                            color: "#fff",
                                                                        }}
                                                                    />

                                                                    {app.test &&
                                                                        app.test
                                                                            .score !==
                                                                            null && (
                                                                            <Chip
                                                                                icon={
                                                                                    <School fontSize="small" />
                                                                                }
                                                                                label={`Score: ${app.test.score}%`}
                                                                                size="small"
                                                                                color="primary"
                                                                                sx={{
                                                                                    maxWidth:
                                                                                        "100%",
                                                                                }}
                                                                            />
                                                                        )}

                                                                    {app.interview_id &&
                                                                        app.test
                                                                            .score ==
                                                                            null && (
                                                                            <Chip
                                                                                icon={
                                                                                    <Schedule fontSize="small" />
                                                                                }
                                                                                label="Interview scheduled"
                                                                                size="small"
                                                                                color="primary"
                                                                            />
                                                                        )}

                                                                    {!app.interview_id &&
                                                                        (app
                                                                            .test
                                                                            .score ==
                                                                            null ||
                                                                            app
                                                                                .test
                                                                                .score ===
                                                                                null) && (
                                                                            <Chip
                                                                                icon={
                                                                                    <HourglassEmpty fontSize="small" />
                                                                                }
                                                                                label="Awaiting interview"
                                                                                size="small"
                                                                                color="default"
                                                                                variant="outlined"
                                                                            />
                                                                        )}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                        flexDirection:
                                                                            {
                                                                                xs: "column",
                                                                                md: "row",
                                                                            },
                                                                        gap: 1,
                                                                        justifyContent:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        color="success"
                                                                        startIcon={
                                                                            <ThumbUp />
                                                                        }
                                                                        onClick={() =>
                                                                            handleUpdateApplicationStatus(
                                                                                app.id,
                                                                                "accepte"
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            actionsDisabled ||
                                                                            app.status ===
                                                                                "accepte"
                                                                        }
                                                                        sx={{
                                                                            minWidth:
                                                                                "100px",
                                                                            color: "#fff",
                                                                        }}
                                                                    >
                                                                        Accept
                                                                    </Button>
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        color="error"
                                                                        startIcon={
                                                                            <ThumbDown />
                                                                        }
                                                                        onClick={() =>
                                                                            handleUpdateApplicationStatus(
                                                                                app.id,
                                                                                "refuse"
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            actionsDisabled ||
                                                                            app.status ===
                                                                                "refuse"
                                                                        }
                                                                        sx={{
                                                                            minWidth:
                                                                                "100px",
                                                                            color: "#fff",
                                                                        }}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </Box>
                                                                {actionsDisabled && (
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                        sx={{
                                                                            display:
                                                                                "block",
                                                                            mt: 1,
                                                                            fontStyle:
                                                                                "italic",
                                                                        }}
                                                                    >
                                                                        Interview
                                                                        must be
                                                                        completed
                                                                        before
                                                                        decision
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                            )}
                                        </TableBody>
                                    </Table>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        py: 5,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "action.hover",
                                        }}
                                    >
                                        <PersonOutline
                                            sx={{
                                                fontSize: 40,
                                                color: "text.secondary",
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        color="text.primary"
                                    >
                                        No applicants found
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ maxWidth: 400, mx: "auto" }}
                                    >
                                        Applications will appear here when
                                        candidates apply to your job postings
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => setTabValue(2)}
                                        startIcon={<Add />}
                                        sx={{ mt: 2 }}
                                    >
                                        Post a New Job
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                )}

                {tabValue === 2 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 3,
                                }}
                            >
                                <Typography variant="h6" component="h2">
                                    Jobs Management
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<WorkOutline />}
                                    onClick={handleCreateJob}
                                    size="small"
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
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Job Title</TableCell>
                                                <TableCell>Salary</TableCell>
                                                <TableCell>
                                                    Posted Date
                                                </TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Actions</TableCell>
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
                                                            <Chip
                                                                label={
                                                                    new Date(
                                                                        job.final_date
                                                                    ) <
                                                                    new Date()
                                                                        ? "Closed"
                                                                        : "Active"
                                                                }
                                                                color={
                                                                    new Date(
                                                                        job.final_date
                                                                    ) <
                                                                    new Date()
                                                                        ? "error"
                                                                        : "success"
                                                                }
                                                                size="small"
                                                                sx={{
                                                                    color: "#fff",
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() =>
                                                                    handleViewJob(
                                                                        job.id
                                                                    )
                                                                }
                                                                sx={{ mr: 1 }}
                                                                title="View"
                                                            >
                                                                <Visibility fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                color="success"
                                                                onClick={() =>
                                                                    handleEditJob(
                                                                        job.id
                                                                    )
                                                                }
                                                                sx={{ mr: 1 }}
                                                                title="Edit"
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() =>
                                                                    handleDeleteJob(
                                                                        job.id
                                                                    )
                                                                }
                                                                title="Delete"
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
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
                                        No job postings found
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Create your first job posting to start
                                        receiving applications
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={handleCreateJob}
                                        sx={{ mt: 2 }}
                                    >
                                        Post a Job
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                )}

                {tabValue === 3 && (
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
            {confirmDialogOpen && (
                <Dialog
                    open={confirmDialogOpen}
                    onClose={handleConfirmDialogClose}
                >
                    <DialogTitle>Confirm Status Update</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to update the application
                            status to{" "}
                            {selectedApplication?.status === "accepte"
                                ? "Accepted"
                                : "Rejected"}
                            ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmDialogClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmStatusUpdate}
                            color="primary"
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default EmployerDashboard;
