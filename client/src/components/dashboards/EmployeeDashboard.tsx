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
    ListItemText,
    Divider,
    Card,
    CardContent,
    Avatar,
    Chip,
    LinearProgress,
    Theme,
    CircularProgress,
    Alert,
} from "@mui/material";
import {
    Work,
    Schedule,
    NotificationsActive,
    TrendingUp,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboard } from "../../contexts/DashboardContext";
import ChangePasswordDialog from "../profile/ChangePasswordDialog ";
import DeleteAccountDialog from "../profile/DeleteAccountDialog ";
import EditProfileDialog from "../profile/EditProfileDialog ";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
    Applied: "#3498db",
    Interview: "#f39c12",
    Rejected: "#e74c3c",
    accepte: "#2ecc71",
};

const EmployeeDashboard = ({ theme }: { theme: Theme }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const { user } = useAuth();
    const { employeeStats, loading, error, fetchEmployeeStats } =
        useDashboard();

    // State for dialogs
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

    // Create a properly formatted display name
    const displayName = user ? `${user.first_name} ${user.last_name}` : "User";

    // Get user email
    const userEmail = user?.email || "No email available";

    // Fetch dashboard stats when component mounts
    useEffect(() => {
        fetchEmployeeStats();
    }, []);

    // Format date function
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch (error) {
            return "Invalid date";
        }
    };

    // Dialog handlers
    const handleEditProfileOpen = () => setEditProfileOpen(true);
    const handleEditProfileClose = () => setEditProfileOpen(false);

    const handleChangePasswordOpen = () => setChangePasswordOpen(true);
    const handleChangePasswordClose = () => setChangePasswordOpen(false);

    const handleDeleteAccountOpen = () => setDeleteAccountOpen(true);
    const handleDeleteAccountClose = () => setDeleteAccountOpen(false);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{ width: 80, height: 80, mr: 3 }}
                            alt={displayName}
                            src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=random`}
                        >
                            {user?.first_name?.[0]}
                            {user?.last_name?.[0]}
                        </Avatar>
                        <Box>
                            <Typography
                                variant="h5"
                                component="h1"
                                gutterBottom
                            >
                                Welcome back, {displayName}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {userEmail} | {user?.role || "Employee"}
                            </Typography>
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
                            onClick={() => setActiveTab("applications")}
                            sx={{
                                mr: 2,
                                color:
                                    activeTab === "applications"
                                        ? "primary.main"
                                        : "text.primary",
                                borderBottom:
                                    activeTab === "applications"
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : "none",
                                borderRadius: 0,
                                pb: 1,
                            }}
                        >
                            Applications
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
                        {activeTab === "overview" && (
                            <>
                                {/* Stats Overview */}
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={3}>
                                        {/* Application Stats */}
                                        <Grid item xs={12} sm={6}>
                                            <Paper
                                                sx={{
                                                    p: 3,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    height: "100%",
                                                    transition:
                                                        "transform 0.3s ease",
                                                    "&:hover": {
                                                        transform:
                                                            "translateY(-5px)",
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        mb: 2,
                                                    }}
                                                >
                                                    <Work
                                                        color="primary"
                                                        sx={{ mr: 1 }}
                                                    />
                                                    <Typography
                                                        variant="h6"
                                                        component="div"
                                                    >
                                                        Application Status
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ mb: 2 }}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <Typography variant="body2">
                                                            Applications
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {employeeStats
                                                                ?.applications
                                                                ?.length || 0}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={100}
                                                        sx={{
                                                            mb: 1,
                                                            height: 8,
                                                            borderRadius: 4,
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ mb: 2 }}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <Typography variant="body2">
                                                            Interviews
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {employeeStats
                                                                ?.interview_history
                                                                ?.length || 0}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={
                                                            employeeStats
                                                                ?.interview_history
                                                                ?.length
                                                                ? (employeeStats
                                                                      .interview_history
                                                                      .length /
                                                                      Math.max(
                                                                          1,
                                                                          employeeStats
                                                                              .applications
                                                                              .length
                                                                      )) *
                                                                  100
                                                                : 0
                                                        }
                                                        sx={{
                                                            mb: 1,
                                                            height: 8,
                                                            borderRadius: 4,
                                                        }}
                                                        color="secondary"
                                                    />
                                                </Box>
                                                <Box>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <Typography variant="body2">
                                                            Average Score
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {employeeStats?.average_score?.toFixed(
                                                                1
                                                            ) || 0}
                                                            %
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={
                                                            employeeStats?.average_score ||
                                                            0
                                                        }
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                        }}
                                                        color="success"
                                                    />
                                                </Box>
                                            </Paper>
                                        </Grid>

                                        {/* Activity Feed */}
                                        <Grid item xs={12} sm={6}>
                                            <Paper
                                                sx={{
                                                    p: 3,
                                                    height: "100%",
                                                    transition:
                                                        "transform 0.3s ease",
                                                    "&:hover": {
                                                        transform:
                                                            "translateY(-5px)",
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        mb: 2,
                                                    }}
                                                >
                                                    <TrendingUp
                                                        color="primary"
                                                        sx={{ mr: 1 }}
                                                    />
                                                    <Typography
                                                        variant="h6"
                                                        component="div"
                                                    >
                                                        Recent Activity
                                                    </Typography>
                                                </Box>
                                                <List
                                                    sx={{
                                                        width: "100%",
                                                        mt: 1,
                                                    }}
                                                >
                                                    {employeeStats
                                                        ?.interview_history
                                                        ?.length ? (
                                                        employeeStats.interview_history
                                                            .slice(0, 3)
                                                            .map(
                                                                (interview) => (
                                                                    <Fragment
                                                                        key={
                                                                            interview.id
                                                                        }
                                                                    >
                                                                        <ListItem>
                                                                            <ListItemText
                                                                                primary={`Interviewed for ${interview.post_title}`}
                                                                                secondary={formatDate(
                                                                                    interview.response_date
                                                                                )}
                                                                            />
                                                                        </ListItem>
                                                                        <Divider component="li" />
                                                                    </Fragment>
                                                                )
                                                            )
                                                    ) : (
                                                        <ListItem>
                                                            <ListItemText
                                                                primary="No recent activity"
                                                                secondary="Your activities will appear here"
                                                            />
                                                        </ListItem>
                                                    )}
                                                </List>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Sidebar */}
                                <Grid item xs={12} md={4}>
                                    {/* Upcoming Events */}
                                    <Paper
                                        sx={{
                                            p: 3,
                                            mb: 3,
                                            transition: "transform 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mb: 2,
                                            }}
                                        >
                                            <Schedule
                                                color="primary"
                                                sx={{ mr: 1 }}
                                            />
                                            <Typography
                                                variant="h6"
                                                component="div"
                                            >
                                                Upcoming Events
                                            </Typography>
                                        </Box>
                                        <List dense sx={{ width: "100%" }}>
                                            {employeeStats?.applications
                                                ?.filter(
                                                    (app) =>
                                                        app.status !== "accepte"
                                                )
                                                ?.slice(0, 3)
                                                .map((app, index) => (
                                                    <Fragment key={index}>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary={`Interview for ${app.post_title}`}
                                                                secondary={`Application: ${formatDate(
                                                                    app.application_date
                                                                )}`}
                                                            />
                                                        </ListItem>
                                                        <Divider component="li" />
                                                    </Fragment>
                                                )) || (
                                                <ListItem>
                                                    <ListItemText
                                                        primary="No upcoming events"
                                                        secondary="Events will appear here when scheduled"
                                                    />
                                                </ListItem>
                                            )}
                                        </List>
                                    </Paper>

                                    {/* Recent Scores */}
                                    <Paper
                                        sx={{
                                            p: 3,
                                            transition: "transform 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                mb: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <NotificationsActive
                                                    color="primary"
                                                    sx={{ mr: 1 }}
                                                />
                                                <Typography
                                                    variant="h6"
                                                    component="div"
                                                >
                                                    Interview Scores
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <List dense sx={{ width: "100%" }}>
                                            {employeeStats?.interview_history
                                                ?.length ? (
                                                employeeStats.interview_history.map(
                                                    (interview) => (
                                                        <Fragment
                                                            key={interview.id}
                                                        >
                                                            <ListItem>
                                                                <ListItemText
                                                                    primary={`${
                                                                        interview.post_title
                                                                    }: ${interview.score.toFixed(
                                                                        1
                                                                    )}%`}
                                                                    secondary={`Question: ${interview.question.substring(
                                                                        0,
                                                                        30
                                                                    )}...`}
                                                                />
                                                            </ListItem>
                                                            <Divider component="li" />
                                                        </Fragment>
                                                    )
                                                )
                                            ) : (
                                                <ListItem>
                                                    <ListItemText
                                                        primary="No interview scores yet"
                                                        secondary="Complete interviews to see your scores"
                                                    />
                                                </ListItem>
                                            )}
                                        </List>
                                    </Paper>
                                </Grid>
                            </>
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
                                                    (application, index) => (
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
                                                                            >
                                                                                Applied
                                                                                on{" "}
                                                                                {formatDate(
                                                                                    application.application_date
                                                                                )}
                                                                            </Typography>
                                                                        </Box>
                                                                        <Chip
                                                                            label={
                                                                                application.status ===
                                                                                "accepte"
                                                                                    ? "Accepted"
                                                                                    : "Pending"
                                                                            }
                                                                            sx={{
                                                                                bgcolor:
                                                                                    statusColors[
                                                                                        application
                                                                                            .status
                                                                                    ] ||
                                                                                    statusColors.Applied,
                                                                                color: "white",
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Box
                                                                        sx={{
                                                                            display:
                                                                                "flex",
                                                                            justifyContent:
                                                                                "flex-end",
                                                                            mt: 2,
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            size="small"
                                                                            variant="text"
                                                                            sx={{
                                                                                mr: 1,
                                                                            }}
                                                                        >
                                                                            View
                                                                            Details
                                                                        </Button>
                                                                        <Button
                                                                            size="small"
                                                                            variant="contained"
                                                                        >
                                                                            {application.status ===
                                                                            "accepte"
                                                                                ? "Contact Employer"
                                                                                : "Follow Up"}
                                                                        </Button>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    )
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

                        {/* Profile tab remains unchanged */}
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
                                                            }}
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                size="medium"
                                                                sx={{ mr: 2 }}
                                                                onClick={
                                                                    handleChangePasswordOpen
                                                                }
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

                                                    {/* <Box
                                                        sx={{
                                                            p: 3,
                                                            borderRadius: 2,
                                                            bgcolor:
                                                                theme.palette
                                                                    .mode ===
                                                                "dark"
                                                                    ? "rgba(255,255,255,0.05)"
                                                                    : "rgba(0,0,0,0.02)",
                                                            border: 1,
                                                            borderColor:
                                                                "divider",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="subtitle2"
                                                            gutterBottom
                                                        >
                                                            Account Status
                                                        </Typography>
                                                        {/* <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "space-between",
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                Active since:{" "}
                                                                {user?.created_at
                                                                    ? formatDate(
                                                                          user.created_at
                                                                      )
                                                                    : "Not available"}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label="Active"
                                                                color="success"
                                                                sx={{
                                                                    fontWeight:
                                                                        "medium",
                                                                }}
                                                            />
                                                        </Box> */}
                                                    {/* </Box> */}
                                                    {/* */}
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
        </Container>
    );
};

export default EmployeeDashboard;
