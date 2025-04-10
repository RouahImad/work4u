import { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Card,
    CardContent,
    Avatar,
    Chip,
    CircularProgress,
    Alert,
    Tooltip,
    Tabs,
    Tab,
} from "@mui/material";
import {
    QuestionAnswer,
    Dashboard,
    AccountCircle,
    EditOutlined,
    List as ListIcon,
    AccessTime,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboard } from "../../contexts/DashboardContext";
import ChangePasswordDialog from "../profile/ChangePasswordDialog";
import DeleteAccountDialog from "../profile/DeleteAccountDialog";
import EditProfileDialog from "../profile/EditProfileDialog";
import InterviewDialog from "../jobs/InterviewDialog";
import Overview from "./employee/OverView";
import { formatDate } from "../../services/utils";

const statusColors: Record<string, string> = {
    Applied: "#3498db",
    Interview: "#f39c12",
    refuse: "#e74c3c",
    accepte: "#2ecc71",
    passed: "#9e9e9e", // Gray color for passed interviews
};

const EmployeeDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const { user } = useAuth();
    const { employeeStats, loading, error, fetchEmployeeStats } =
        useDashboard();

    // State for dialogs
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

    // Interview dialog state
    const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedPostTitle, setSelectedPostTitle] = useState<string>("");

    // Create a properly formatted display name
    const displayName = user ? `${user.first_name} ${user.last_name}` : "User";

    // Get user email
    const userEmail = user?.email || "No email available";

    // Fetch dashboard stats when component mounts
    useEffect(() => {
        fetchEmployeeStats();
    }, []);

    // Dialog handlers
    const handleEditProfileOpen = () => setEditProfileOpen(true);
    const handleEditProfileClose = () => setEditProfileOpen(false);

    const handleChangePasswordOpen = () => setChangePasswordOpen(true);
    const handleChangePasswordClose = () => setChangePasswordOpen(false);

    const handleDeleteAccountOpen = () => setDeleteAccountOpen(true);
    const handleDeleteAccountClose = () => setDeleteAccountOpen(false);

    // Interview dialog handlers
    const handleInterviewStart = (applicationId: number, postTitle: string) => {
        setSelectedId(applicationId);
        setSelectedPostTitle(postTitle);
        setInterviewDialogOpen(true);
    };

    const handleInterviewClose = () => {
        setInterviewDialogOpen(false);
        setSelectedId(null);
        setSelectedPostTitle("");
        // Refresh data after interview completion
        fetchEmployeeStats();
    };

    // Helper function to check if an interview final date has passed
    const hasInterviewDatePassed = (date: string | undefined): boolean => {
        if (!date) return false;
        const finalDate = new Date(date);
        const today = new Date();
        return finalDate < today;
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                mr: {
                                    xs: 2,
                                    sm: 3,
                                },
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
                                    Welcome back, {displayName}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    {userEmail} | {user?.role || "Employee"}
                                </Typography>
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
                        sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
                    >
                        <Tabs
                            value={activeTab}
                            onChange={(_e, newValue) => setActiveTab(newValue)}
                            aria-label="employee dashboard tabs"
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab
                                label="Overview"
                                value="overview"
                                icon={<Dashboard />}
                                iconPosition="start"
                                sx={{
                                    textTransform: "none",
                                    minWidth: 100,
                                }}
                            />
                            <Tab
                                label="Applications"
                                value="applications"
                                icon={<ListIcon />}
                                iconPosition="start"
                                sx={{
                                    textTransform: "none",
                                    minWidth: 100,
                                }}
                            />
                            <Tab
                                label="Profile"
                                value="profile"
                                icon={<AccountCircle />}
                                iconPosition="start"
                                sx={{
                                    textTransform: "none",
                                    minWidth: 100,
                                }}
                            />
                        </Tabs>
                    </Box>
                </Grid>

                {/* Show loading indicator or error if applicable */}
                {loading ? (
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                p: 4,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    </Grid>
                ) : error ? (
                    <Grid item xs={12}>
                        <Alert severity="error">{error}</Alert>
                    </Grid>
                ) : (
                    <>
                        {/* Render the appropriate tab content */}
                        {activeTab === "overview" && (
                            <Overview
                                employeeStats={employeeStats}
                                setActiveTab={setActiveTab}
                                handleInterviewStart={handleInterviewStart}
                                loading={loading}
                                error={error}
                            />
                        )}

                        {activeTab === "applications" && (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3 }}>
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        gutterBottom
                                    >
                                        Your Job Applications
                                    </Typography>
                                    {employeeStats?.applications?.length ? (
                                        <Box
                                            sx={{
                                                width: "100%",
                                                overflow: "auto",
                                            }}
                                        >
                                            <Grid container spacing={2}>
                                                {employeeStats.applications.map(
                                                    (application, index) => {
                                                        const interviewDetails =
                                                            employeeStats.interview_history?.find(
                                                                (interview) =>
                                                                    interview.id ===
                                                                    application.interview_id
                                                            );

                                                        const interviewPassed =
                                                            interviewDetails &&
                                                            hasInterviewDatePassed(
                                                                interviewDetails.final_date
                                                            );

                                                        return (
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                key={index}
                                                            >
                                                                <Card variant="outlined">
                                                                    <CardContent>
                                                                        <Box
                                                                            sx={{
                                                                                display:
                                                                                    "flex",
                                                                                justifyContent:
                                                                                    "space-between",
                                                                                alignItems:
                                                                                    "flex-start",
                                                                            }}
                                                                        >
                                                                            <Box>
                                                                                <Typography
                                                                                    variant="h6"
                                                                                    component="div"
                                                                                    sx={{
                                                                                        mb: 1,
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        application.post_title
                                                                                    }
                                                                                </Typography>
                                                                                <Typography
                                                                                    variant="caption"
                                                                                    display="block"
                                                                                    gutterBottom
                                                                                    color="primary"
                                                                                >
                                                                                    Applied
                                                                                    on{" "}
                                                                                    {formatDate(
                                                                                        application.application_date,
                                                                                        true
                                                                                    )}
                                                                                </Typography>
                                                                                {interviewDetails &&
                                                                                    interviewPassed && (
                                                                                        <Typography
                                                                                            variant="caption"
                                                                                            display="block"
                                                                                            sx={{
                                                                                                color: "text.secondary",
                                                                                                display:
                                                                                                    "flex",
                                                                                                alignItems:
                                                                                                    "center",
                                                                                                gap: 0.5,
                                                                                            }}
                                                                                        >
                                                                                            <AccessTime fontSize="small" />
                                                                                            Interview
                                                                                            deadline
                                                                                            passed:{" "}
                                                                                            {formatDate(
                                                                                                interviewDetails.final_date
                                                                                            )}
                                                                                        </Typography>
                                                                                    )}
                                                                            </Box>
                                                                            <Box
                                                                                sx={{
                                                                                    display:
                                                                                        "flex",
                                                                                    gap: 1,
                                                                                    flexDirection:
                                                                                        "column",
                                                                                    alignItems:
                                                                                        "flex-end",
                                                                                }}
                                                                            >
                                                                                <Chip
                                                                                    label={
                                                                                        application.status ===
                                                                                        "accepte"
                                                                                            ? "Accepted"
                                                                                            : application.status ===
                                                                                              "refuse"
                                                                                            ? "Rejected"
                                                                                            : "Pending"
                                                                                    }
                                                                                    sx={{
                                                                                        bgcolor:
                                                                                            interviewPassed &&
                                                                                            application.status ===
                                                                                                "en_attente"
                                                                                                ? statusColors.passed
                                                                                                : statusColors[
                                                                                                      application
                                                                                                          .status
                                                                                                  ] ||
                                                                                                  statusColors.Applied,
                                                                                        color: "white",
                                                                                    }}
                                                                                />

                                                                                {interviewDetails && (
                                                                                    <Chip
                                                                                        size="small"
                                                                                        label={`Score: ${interviewDetails.score}%`}
                                                                                        color="primary"
                                                                                        variant="outlined"
                                                                                        sx={{
                                                                                            fontSize:
                                                                                                "0.75rem",
                                                                                        }}
                                                                                    />
                                                                                )}

                                                                                {interviewPassed && (
                                                                                    <Chip
                                                                                        size="small"
                                                                                        label="Deadline Passed"
                                                                                        color="default"
                                                                                        sx={{
                                                                                            fontSize:
                                                                                                "0.75rem",
                                                                                            bgcolor:
                                                                                                statusColors.passed,
                                                                                            color: "white",
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Box>
                                                                        </Box>
                                                                        <Box
                                                                            sx={{
                                                                                display:
                                                                                    "flex",
                                                                                justifyContent:
                                                                                    "flex-end",
                                                                                mt: 2,
                                                                                gap: 1,
                                                                            }}
                                                                        >
                                                                            {/* Interview button */}
                                                                            <Tooltip
                                                                                title={
                                                                                    application.interview_id !=
                                                                                    null
                                                                                        ? interviewPassed
                                                                                            ? "Interview deadline has passed"
                                                                                            : "Interview already taken"
                                                                                        : "Take an automated interview for this position"
                                                                                }
                                                                            >
                                                                                <span>
                                                                                    <Button
                                                                                        size="small"
                                                                                        variant="outlined"
                                                                                        color="secondary"
                                                                                        startIcon={
                                                                                            <QuestionAnswer />
                                                                                        }
                                                                                        onClick={() =>
                                                                                            handleInterviewStart(
                                                                                                application.application_id,
                                                                                                application.post_title
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            application.interview_id !=
                                                                                                null ||
                                                                                            interviewPassed
                                                                                        }
                                                                                    >
                                                                                        {interviewPassed
                                                                                            ? "Interview Expired"
                                                                                            : application.interview_id !=
                                                                                              null
                                                                                            ? "Interview Completed"
                                                                                            : "Take Interview"}
                                                                                    </Button>
                                                                                </span>
                                                                            </Tooltip>
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        );
                                                    }
                                                )}
                                            </Grid>
                                        </Box>
                                    ) : (
                                        <Typography
                                            variant="body1"
                                            align="center"
                                            sx={{ my: 4 }}
                                        >
                                            You haven't applied to any jobs yet.
                                        </Typography>
                                    )}
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
                                        boxShadow:
                                            "0 4px 12px rgba(0,0,0,0.05)",
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
                                            Your Profile
                                        </Typography>
                                        <Typography variant="body2">
                                            Manage your personal information and
                                            account settings
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
                                                        transition:
                                                            "all 0.2s ease",
                                                        "&:hover": {
                                                            boxShadow:
                                                                "0 4px 8px rgba(0,0,0,0.1)",
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            mb: 3,
                                                            pb: 2,
                                                            borderBottom: 1,
                                                            borderColor:
                                                                "divider",
                                                        }}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                width: 60,
                                                                height: 60,
                                                                mr: 2,
                                                                bgcolor:
                                                                    "primary.main",
                                                            }}
                                                            alt={displayName}
                                                            src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=random`}
                                                        >
                                                            {
                                                                user
                                                                    ?.first_name?.[0]
                                                            }
                                                            {
                                                                user
                                                                    ?.last_name?.[0]
                                                            }
                                                        </Avatar>
                                                        <Box>
                                                            <Typography
                                                                variant="h6"
                                                                component="div"
                                                            >
                                                                Personal
                                                                Information
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                Your basic
                                                                profile details
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            color="text.secondary"
                                                            gutterBottom
                                                        >
                                                            Name
                                                        </Typography>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight="medium"
                                                        >
                                                            {displayName}
                                                        </Typography>
                                                    </Box>

                                                    {user?.username && (
                                                        <Box sx={{ mb: 3 }}>
                                                            <Typography
                                                                variant="subtitle2"
                                                                color="text.secondary"
                                                                gutterBottom
                                                            >
                                                                Username
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight="medium"
                                                            >
                                                                {user.username}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            color="text.secondary"
                                                            gutterBottom
                                                        >
                                                            Email
                                                        </Typography>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight="medium"
                                                        >
                                                            {userEmail}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            color="text.secondary"
                                                            gutterBottom
                                                        >
                                                            Role
                                                        </Typography>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight="medium"
                                                            sx={{
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                        >
                                                            {user?.role ||
                                                                "Employee"}
                                                        </Typography>
                                                    </Box>

                                                    <Button
                                                        variant="contained"
                                                        size="medium"
                                                        sx={{ mt: 1 }}
                                                        onClick={
                                                            handleEditProfileOpen
                                                        }
                                                        fullWidth
                                                    >
                                                        Edit Information
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
                                                        transition:
                                                            "all 0.2s ease",
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
                                                            borderColor:
                                                                "divider",
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
                                                            Manage your account
                                                            security
                                                        </Typography>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            p: 3,
                                                            mb: 2,
                                                            borderRadius: 2,
                                                            bgcolor:
                                                                "action.hover",
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            alignItems:
                                                                "center",
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
                                                            Changing your
                                                            password regularly
                                                            helps keep your
                                                            account secure
                                                        </Typography>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                    </>
                )}
            </Grid>

            {/* Dialogs */}
            <EditProfileDialog
                open={editProfileOpen}
                onClose={handleEditProfileClose}
            />
            <ChangePasswordDialog
                open={changePasswordOpen}
                onClose={handleChangePasswordClose}
            />
            <DeleteAccountDialog
                open={deleteAccountOpen}
                onClose={handleDeleteAccountClose}
            />

            {/* Interview Dialog */}
            {selectedId && (
                <InterviewDialog
                    open={interviewDialogOpen}
                    onClose={handleInterviewClose}
                    applicationId={selectedId}
                    postTitle={selectedPostTitle}
                    interviewTime={30} // 30-minute interview
                />
            )}
        </Container>
    );
};

export default EmployeeDashboard;
