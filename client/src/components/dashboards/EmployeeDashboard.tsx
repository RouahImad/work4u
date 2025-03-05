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
    // CheckCircle,
    Schedule,
    NotificationsActive,
    InsertDriveFile,
    Star,
    // School,
    TrendingUp,
} from "@mui/icons-material";

// Mock data
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

const recommendedJobs = [
    { id: 1, title: "Frontend Developer", company: "WebTech", match: 95 },
    {
        id: 2,
        title: "React Native Developer",
        company: "MobileApps",
        match: 88,
    },
    { id: 3, title: "Software Engineer", company: "SoftSolutions", match: 82 },
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

const EmployeeDashboard = ({
    theme,
}: // darkMode,
{
    theme: Theme;
    // darkMode: boolean;
}) => {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Grid container spacing={3}>
                {/* Profile Summary */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{ width: 80, height: 80, mr: 3 }}
                            src="https://via.placeholder.com/150"
                        />
                        <Box>
                            <Typography
                                variant="h5"
                                component="h1"
                                gutterBottom
                            >
                                Welcome back, Alex Johnson
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Full Stack Developer | New York, NY
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <Chip
                                    icon={<InsertDriveFile fontSize="small" />}
                                    label="Resume Uploaded"
                                    size="small"
                                    color="success"
                                    sx={{ mr: 1 }}
                                />
                                <Chip
                                    icon={<Star fontSize="small" />}
                                    label="Profile Strength: Strong"
                                    size="small"
                                    color="primary"
                                />
                            </Box>
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
                            onClick={() => setActiveTab("recommendations")}
                            sx={{
                                mr: 2,
                                color:
                                    activeTab === "recommendations"
                                        ? "primary.main"
                                        : "text.primary",
                                borderBottom:
                                    activeTab === "recommendations"
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : "none",
                                borderRadius: 0,
                                pb: 1,
                            }}
                        >
                            Job Recommendations
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

                {activeTab === "recommendations" && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography
                                variant="h6"
                                component="h2"
                                gutterBottom
                            >
                                Recommended Jobs for You
                            </Typography>
                            <Grid container spacing={2}>
                                {recommendedJobs.map((job) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={job.id}
                                    >
                                        <Card
                                            sx={{
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                transition:
                                                    "transform 0.2s ease-in-out",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                    boxShadow: 3,
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box sx={{ mb: 2 }}>
                                                    <Chip
                                                        label={`${job.match}% Match`}
                                                        color="primary"
                                                        size="small"
                                                        sx={{ mb: 1 }}
                                                    />
                                                    <Typography
                                                        variant="h6"
                                                        component="div"
                                                        sx={{ mb: 1 }}
                                                    >
                                                        {job.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        gutterBottom
                                                    >
                                                        {job.company}
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                >
                                                    View Job
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
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
                                                    Alex Johnson
                                                </Typography>
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Email
                                                </Typography>
                                                <Typography variant="body1">
                                                    alex.johnson@example.com
                                                </Typography>
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Location
                                                </Typography>
                                                <Typography variant="body1">
                                                    New York, NY
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Phone
                                                </Typography>
                                                <Typography variant="body1">
                                                    (555) 123-4567
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ mt: 2 }}
                                            >
                                                Edit Information
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                component="div"
                                            >
                                                Education
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body1">
                                                    Bachelor of Science in
                                                    Computer Science
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    University of Technology
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    2017 - 2021
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                            >
                                                Add Education
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card sx={{ mb: 3 }}>
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                component="div"
                                            >
                                                Work Experience
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body1">
                                                    Junior Developer
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    TechStart Inc.
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    2021 - Present
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                            >
                                                Add Experience
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                component="div"
                                            >
                                                Skills
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                {[
                                                    "React",
                                                    "TypeScript",
                                                    "Node.js",
                                                    "MongoDB",
                                                    "Git",
                                                    "AWS",
                                                ].map((skill) => (
                                                    <Chip
                                                        key={skill}
                                                        label={skill}
                                                        size="small"
                                                        sx={{ mr: 1, mb: 1 }}
                                                    />
                                                ))}
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                            >
                                                Edit Skills
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default EmployeeDashboard;
