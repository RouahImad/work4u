import { useState, Fragment } from "react";
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
} from "@mui/material";
import {
    Work,
    Schedule,
    NotificationsActive,
    TrendingUp,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import ChangePasswordDialog from "../profile/ChangePasswordDialog ";
import DeleteAccountDialog from "../profile/DeleteAccountDialog ";
import EditProfileDialog from "../profile/EditProfileDialog ";

const applications = [
    {
        id: 1,
        company: "TechCorp",
        position: "Full Stack Developer",
        status: "Interview",
        date: "2023-05-15",
    },
    {
        id: 2,
        company: "DesignHub",
        position: "UX Designer",
        status: "Applied",
        date: "2023-05-10",
    },
    {
        id: 3,
        company: "CloudSystems",
        position: "DevOps Engineer",
        status: "Rejected",
        date: "2023-05-05",
    },
    {
        id: 4,
        company: "DataInsights",
        position: "Data Scientist",
        status: "Screening",
        date: "2023-05-01",
    },
];

const notifications = [
    {
        id: 1,
        message: "Interview scheduled with TechCorp",
        time: "2 hours ago",
        read: false,
    },
    {
        id: 2,
        message: "New message from recruiter",
        time: "1 day ago",
        read: true,
    },
    {
        id: 3,
        message: "Your resume was viewed by 5 employers",
        time: "3 days ago",
        read: true,
    },
];

// Status color mapping
const statusColors: Record<string, string> = {
    Applied: "#3498db",
    Interview: "#f39c12",
    Rejected: "#e74c3c",
    Screening: "#9b59b6",
    Hired: "#2ecc71",
};

const EmployeeDashboard = ({ theme }: { theme: Theme }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const { user } = useAuth();

    // State for dialogs
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

    // Create a properly formatted display name
    const displayName = user ? `${user.first_name} ${user.last_name}` : "User";

    // Get user email
    const userEmail = user?.email || "No email available";

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
                {/* Profile Summary - Updated with real user data */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{ width: 80, height: 80, mr: 3 }}
                            // Generate avatar from initials if no image
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
                                                    Applied
                                                </Typography>
                                                <Typography variant="body2">
                                                    5
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={50}
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
                                                    2
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={20}
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
                                                    Offers
                                                </Typography>
                                                <Typography variant="body2">
                                                    1
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={10}
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
                                        <List sx={{ width: "100%", mt: 1 }}>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Applied to Frontend Developer position"
                                                    secondary="Today"
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                            <ListItem>
                                                <ListItemText
                                                    primary="Profile viewed by WebTech"
                                                    secondary="Yesterday"
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                            <ListItem>
                                                <ListItemText
                                                    primary="Skills assessment completed"
                                                    secondary="2 days ago"
                                                />
                                            </ListItem>
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
                                    <Schedule color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="h6" component="div">
                                        Upcoming Events
                                    </Typography>
                                </Box>
                                <List dense sx={{ width: "100%" }}>
                                    <ListItem>
                                        <ListItemText
                                            primary="Interview with TechCorp"
                                            secondary="Tomorrow, 2:00 PM"
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                    <ListItem>
                                        <ListItemText
                                            primary="Technical Assessment"
                                            secondary="May 20, 10:00 AM"
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                    <ListItem>
                                        <ListItemText
                                            primary="Career Fair"
                                            secondary="May 25, 9:00 AM"
                                        />
                                    </ListItem>
                                </List>
                            </Paper>

                            {/* Notifications */}
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
                                            Notifications
                                        </Typography>
                                    </Box>
                                    <Button size="small">
                                        Mark all as read
                                    </Button>
                                </Box>
                                <List dense sx={{ width: "100%" }}>
                                    {notifications.map((notification) => (
                                        <Fragment key={notification.id}>
                                            <ListItem
                                                sx={{
                                                    bgcolor: notification.read
                                                        ? "transparent"
                                                        : "action.hover",
                                                    borderRadius: 1,
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        notification.message
                                                    }
                                                    secondary={
                                                        notification.time
                                                    }
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                        </Fragment>
                                    ))}
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
                            <Box sx={{ width: "100%", overflow: "auto" }}>
                                <Grid container spacing={2}>
                                    {applications.map((application) => (
                                        <Grid item xs={12} key={application.id}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
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
                                                                sx={{ mb: 1 }}
                                                            >
                                                                {
                                                                    application.position
                                                                }
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                gutterBottom
                                                            >
                                                                {
                                                                    application.company
                                                                }
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                display="block"
                                                                gutterBottom
                                                            >
                                                                Applied on{" "}
                                                                {
                                                                    application.date
                                                                }
                                                            </Typography>
                                                        </Box>
                                                        <Chip
                                                            label={
                                                                application.status
                                                            }
                                                            sx={{
                                                                bgcolor:
                                                                    statusColors[
                                                                        application.status as keyof typeof statusColors
                                                                    ],
                                                                color: "white",
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "flex-end",
                                                            mt: 2,
                                                        }}
                                                    >
                                                        <Button
                                                            size="small"
                                                            variant="text"
                                                            sx={{ mr: 1 }}
                                                        >
                                                            View Details
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                        >
                                                            Follow Up
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                )}

                {activeTab === "profile" && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography
                                variant="h6"
                                component="h2"
                                gutterBottom
                            >
                                Your Profile
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ mb: 3 }}>
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                component="div"
                                            >
                                                Personal Information
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Name
                                                </Typography>
                                                <Typography variant="body1">
                                                    {displayName}
                                                </Typography>
                                            </Box>
                                            {user?.username && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Username
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {user.username}
                                                    </Typography>
                                                </Box>
                                            )}
                                            <Box sx={{ mb: 2 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Email
                                                </Typography>
                                                <Typography variant="body1">
                                                    {userEmail}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Role
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        textTransform:
                                                            "capitalize",
                                                    }}
                                                >
                                                    {user?.role || "Employee"}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ mt: 2 }}
                                                onClick={handleEditProfileOpen}
                                            >
                                                Edit Information
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Account settings card */}
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                component="div"
                                            >
                                                Account Settings
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                    onClick={
                                                        handleChangePasswordOpen
                                                    }
                                                >
                                                    Change Password
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                    onClick={
                                                        handleDeleteAccountOpen
                                                    }
                                                >
                                                    Delete Account
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
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
