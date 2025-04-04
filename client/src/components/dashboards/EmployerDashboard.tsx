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
    Badge,
    Theme,
} from "@mui/material";
import { MoreVert, Add, EditOutlined } from "@mui/icons-material";
import { useNotification } from "../notifications/SlideInNotifications";
import { useAuth } from "../../contexts/AuthContext";

// Mock data
const jobPostings = [
    {
        id: 1,
        title: "Full Stack Developer",
        applicants: 28,
        newApplicants: 5,
        posted: "2023-05-01",
        status: "Active",
        views: 342,
    },
    {
        id: 2,
        title: "UX/UI Designer",
        applicants: 16,
        newApplicants: 2,
        posted: "2023-05-05",
        status: "Active",
        views: 211,
    },
    {
        id: 3,
        title: "DevOps Engineer",
        applicants: 11,
        newApplicants: 0,
        posted: "2023-04-20",
        status: "Closed",
        views: 198,
    },
    {
        id: 4,
        title: "Data Scientist",
        applicants: 22,
        newApplicants: 7,
        posted: "2023-05-10",
        status: "Active",
        views: 156,
    },
];

const topApplicants = [
    {
        id: 1,
        name: "John Smith",
        position: "Full Stack Developer",
        match: 92,
        status: "New",
    },
    {
        id: 2,
        name: "Sarah Johnson",
        position: "UX/UI Designer",
        match: 89,
        status: "Contacted",
    },
    {
        id: 3,
        name: "David Chen",
        position: "Data Scientist",
        match: 85,
        status: "New",
    },
];

const recentActivity = [
    {
        id: 1,
        action: "New application received for Full Stack Developer",
        time: "10 minutes ago",
    },
    {
        id: 2,
        action: "Candidate accepted interview invitation",
        time: "2 hours ago",
    },
    { id: 3, action: "Job posting analytics updated", time: "Yesterday" },
    {
        id: 4,
        action: "5 new candidates matched with your job posting",
        time: "2 days ago",
    },
];

const EmployerDashboard = ({ theme }: { theme: Theme }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedJob, setSelectedJob] = useState<number | null>(null);
    const { pushNotification } = useNotification();
    const { user } = useAuth(); // Get the user data from context

    const handleMenuClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        jobId: number
    ) => {
        setAnchorEl(event.currentTarget);
        setSelectedJob(jobId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedJob(null);
    };

    const handleCreateJob = () => {
        pushNotification("Create job feature coming soon!", "info");
    };

    const handleViewApplicants = () => {
        pushNotification("Viewing all applicants feature coming soon!", "info");
    };

    // Get company information from user data
    const companyName = user?.company_name || "undefined";
    const companyAddress = user?.company_address || "undefined";
    const companyWebsite = user?.company_website || "undefined";

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Grid container spacing={3}>
                {/* Company Profile Summary */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, display: "flex", alignItems: "center" }}>
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
                            sx={{ ml: "auto" }}
                            startIcon={<EditOutlined />}
                        >
                            Edit Profile
                        </Button>
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
                            onClick={() => setActiveTab("jobs")}
                            sx={{
                                mr: 2,
                                color:
                                    activeTab === "jobs"
                                        ? "primary.main"
                                        : "text.primary",
                                borderBottom:
                                    activeTab === "jobs"
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : "none",
                                borderRadius: 0,
                                pb: 1,
                            }}
                        >
                            Job Postings
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
                    </Box>
                </Grid>

                {activeTab === "overview" && (
                    <>
                        {/* Stats Cards */}
                        <Grid item xs={12} md={8}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            height: 140,
                                            transition: "transform 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                            },
                                        }}
                                    >
                                        <Box sx={{ mb: 1 }}>
                                            <Typography
                                                color="text.secondary"
                                                variant="overline"
                                            >
                                                Active Job Postings
                                            </Typography>
                                        </Box>
                                        <Typography component="p" variant="h3">
                                            3
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mt: "auto",
                                            }}
                                        >
                                            <Typography
                                                color="success.main"
                                                sx={{ mr: 1 }}
                                                variant="body2"
                                            >
                                                +1
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="caption"
                                            >
                                                this month
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            height: 140,
                                            transition: "transform 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                            },
                                        }}
                                    >
                                        <Box sx={{ mb: 1 }}>
                                            <Typography
                                                color="text.secondary"
                                                variant="overline"
                                            >
                                                Total Applicants
                                            </Typography>
                                        </Box>
                                        <Typography component="p" variant="h3">
                                            77
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mt: "auto",
                                            }}
                                        >
                                            <Typography
                                                color="success.main"
                                                sx={{ mr: 1 }}
                                                variant="body2"
                                            >
                                                +14
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="caption"
                                            >
                                                this week
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            height: 140,
                                            transition: "transform 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                            },
                                        }}
                                    >
                                        <Box sx={{ mb: 1 }}>
                                            <Typography
                                                color="text.secondary"
                                                variant="overline"
                                            >
                                                New Applicants
                                            </Typography>
                                        </Box>
                                        <Typography component="p" variant="h3">
                                            14
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mt: "auto",
                                            }}
                                        >
                                            <Typography
                                                color="error.main"
                                                sx={{ mr: 1 }}
                                                variant="body2"
                                            >
                                                -2
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="caption"
                                            >
                                                vs last week
                                            </Typography>
                                        </Box>
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
                                        <TableContainer>
                                            <Table size="medium">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            Job Title
                                                        </TableCell>
                                                        <TableCell>
                                                            Status
                                                        </TableCell>
                                                        <TableCell>
                                                            Applicants
                                                        </TableCell>
                                                        <TableCell>
                                                            Views
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
                                                    {jobPostings.map((job) => (
                                                        <TableRow key={job.id}>
                                                            <TableCell>
                                                                {job.title}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={
                                                                        job.status
                                                                    }
                                                                    color={
                                                                        job.status ===
                                                                        "Active"
                                                                            ? "success"
                                                                            : "default"
                                                                    }
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    badgeContent={
                                                                        job.newApplicants
                                                                    }
                                                                    color="secondary"
                                                                    invisible={
                                                                        job.newApplicants ===
                                                                        0
                                                                    }
                                                                >
                                                                    <Typography component="span">
                                                                        {
                                                                            job.applicants
                                                                        }
                                                                    </Typography>
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {job.views}
                                                            </TableCell>
                                                            <TableCell>
                                                                {job.posted}
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
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Menu
                                            id="job-actions-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={handleMenuClose}>
                                                View Details
                                            </MenuItem>
                                            <MenuItem onClick={handleMenuClose}>
                                                Edit Posting
                                            </MenuItem>
                                            <MenuItem onClick={handleMenuClose}>
                                                View Applicants
                                            </MenuItem>
                                            <MenuItem onClick={handleMenuClose}>
                                                {selectedJob &&
                                                jobPostings.find(
                                                    (job) =>
                                                        job.id === selectedJob
                                                )?.status === "Active"
                                                    ? "Close Posting"
                                                    : "Reopen Posting"}
                                            </MenuItem>
                                            <MenuItem onClick={handleMenuClose}>
                                                Delete
                                            </MenuItem>
                                        </Menu>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Sidebar */}
                        <Grid item xs={12} md={4}>
                            {/* Top Applicants */}
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
                                    Top Applicants
                                </Typography>
                                <List dense>
                                    {topApplicants.map((applicant) => (
                                        <Fragment key={applicant.id}>
                                            <ListItem>
                                                {/* Fixed version without nesting errors */}
                                                <Box sx={{ width: "100%" }}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        <Typography variant="body1">
                                                            {applicant.name}
                                                        </Typography>
                                                        <Chip
                                                            label={`${applicant.match}%`}
                                                            size="small"
                                                            color="primary"
                                                        />
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
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
                                                            {applicant.position}
                                                        </Typography>
                                                        <Chip
                                                            label={
                                                                applicant.status
                                                            }
                                                            size="small"
                                                            color={
                                                                applicant.status ===
                                                                "New"
                                                                    ? "secondary"
                                                                    : "default"
                                                            }
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </Box>
                                            </ListItem>
                                            <Divider component="li" />
                                        </Fragment>
                                    ))}
                                </List>
                                <Button
                                    size="small"
                                    sx={{ mt: 1, alignSelf: "flex-end" }}
                                    onClick={handleViewApplicants}
                                >
                                    View all applicants
                                </Button>
                            </Paper>

                            {/* Recent Activity */}
                            <Paper
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography
                                    component="h2"
                                    variant="h6"
                                    color="primary"
                                    gutterBottom
                                >
                                    Recent Activity
                                </Typography>
                                <List dense>
                                    {recentActivity.map((activity) => (
                                        <Fragment key={activity.id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={activity.action}
                                                    secondary={activity.time}
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

                {activeTab === "jobs" && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 3,
                                }}
                            >
                                <Typography variant="h6" component="h2">
                                    Manage Job Postings
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={handleCreateJob}
                                >
                                    Create New Job
                                </Button>
                            </Box>

                            {/* Add job management UI here */}
                            <Typography variant="body1">
                                Detailed job management content would go here...
                            </Typography>
                        </Paper>
                    </Grid>
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

                            {/* Add applicant management UI here */}
                            <Typography variant="body1">
                                Detailed applicant management content would go
                                here...
                            </Typography>
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
            </Grid>
        </Container>
    );
};

export default EmployerDashboard;
