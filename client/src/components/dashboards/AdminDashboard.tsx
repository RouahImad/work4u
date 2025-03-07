import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Tab,
    Tabs,
    // Card,
    // CardContent,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Badge,
    // List,
    // ListItem,
    // ListItemAvatar,
    // ListItemText,
    Divider,
    // Theme,
} from "@mui/material";
import {
    SupervisorAccount,
    Business,
    Person,
    Flag,
    // Timeline,
    WorkOutline,
    Security,
    Settings,
    DeleteOutline,
    Block,
    CheckCircle,
    AssignmentInd,
} from "@mui/icons-material";

// Mock data
const usersOverview = {
    total: 528,
    employees: 412,
    employers: 86,
    admins: 4,
    newToday: 12,
    pendingVerification: 8,
    flagged: 3,
};

const recentUsers = [
    {
        id: 1,
        name: "Alex Martinez",
        email: "alex.m@example.com",
        role: "employee",
        joinDate: "2023-05-10",
        status: "active",
        avatar: "https://via.placeholder.com/40",
    },
    {
        id: 2,
        name: "TechCorp Inc.",
        email: "hr@techcorp.com",
        role: "employer",
        joinDate: "2023-05-09",
        status: "pending",
        avatar: "https://via.placeholder.com/40",
    },
    {
        id: 3,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        role: "employee",
        joinDate: "2023-05-08",
        status: "active",
        avatar: "https://via.placeholder.com/40",
    },
    {
        id: 4,
        name: "DevHub Ltd.",
        email: "contact@devhub.io",
        role: "employer",
        joinDate: "2023-05-07",
        status: "active",
        avatar: "https://via.placeholder.com/40",
    },
    {
        id: 5,
        name: "Michael Brown",
        email: "michael.b@example.com",
        role: "employee",
        joinDate: "2023-05-06",
        status: "flagged",
        avatar: "https://via.placeholder.com/40",
    },
];

const jobsOverview = {
    total: 246,
    active: 158,
    pending: 47,
    closed: 41,
    reported: 5,
};

const recentReports = [
    {
        id: 1,
        type: "User Report",
        subject: "Inappropriate behavior",
        reportedUser: "Michael Brown",
        date: "2023-05-10",
        status: "pending",
    },
    {
        id: 2,
        type: "Job Report",
        subject: "Misleading job description",
        reportedJob: "Senior Developer at TechCorp",
        date: "2023-05-09",
        status: "resolved",
    },
    {
        id: 3,
        type: "User Report",
        subject: "Fake company profile",
        reportedUser: "QuickHire Agency",
        date: "2023-05-08",
        status: "pending",
    },
];

const AdminDashboard = () =>
    //     {
    //     theme,
    //     darkMode,
    // }: {
    //     theme: Theme;
    //     darkMode: boolean;
    // }
    {
        const [tabValue, setTabValue] = useState(0);

        const handleTabChange = (newValue: number) => {
            setTabValue(newValue);
        };

        // Status color mapping
        const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                case "active":
                    return "success";
                case "pending":
                    return "warning";
                case "flagged":
                    return "error";
                default:
                    return "default";
            }
        };

        // Role icon mapping
        const getRoleIcon = (role: string) => {
            switch (role.toLowerCase()) {
                case "employee":
                    return <Person fontSize="small" />;
                case "employer":
                    return <Business fontSize="small" />;
                case "admin":
                    return <SupervisorAccount fontSize="small" />;
                default:
                    return <Person fontSize="small" />;
            }
        };

        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Manage users, jobs, and platform settings
                    </Typography>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={() => {
                            handleTabChange(tabValue);
                        }}
                        aria-label="admin dashboard tabs"
                    >
                        <Tab
                            icon={<SupervisorAccount />}
                            iconPosition="start"
                            label="Overview"
                        />
                        <Tab
                            icon={<Person />}
                            iconPosition="start"
                            label="Users"
                        />
                        <Tab
                            icon={<WorkOutline />}
                            iconPosition="start"
                            label="Jobs"
                        />
                        <Tab
                            icon={<Flag />}
                            iconPosition="start"
                            label="Reports"
                        />
                        <Tab
                            icon={<Settings />}
                            iconPosition="start"
                            label="Settings"
                        />
                    </Tabs>
                </Box>

                {tabValue === 0 && (
                    <Grid container spacing={3}>
                        {/* Users Overview Card */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Users Overview
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: "center", p: 1 }}>
                                            <Typography variant="h4">
                                                {usersOverview.total}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Total Users
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: "center", p: 1 }}>
                                            <Typography variant="h4">
                                                {usersOverview.employees}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Job Seekers
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: "center", p: 1 }}>
                                            <Typography variant="h4">
                                                {usersOverview.employers}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Employers
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: "center", p: 1 }}>
                                            <Typography variant="h4">
                                                {usersOverview.admins}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Admins
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
                                                    usersOverview.newToday
                                                }
                                                color="primary"
                                            >
                                                <Chip
                                                    icon={<AssignmentInd />}
                                                    label="New Today"
                                                    variant="outlined"
                                                />
                                            </Badge>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Badge
                                                badgeContent={
                                                    usersOverview.pendingVerification
                                                }
                                                color="warning"
                                            >
                                                <Chip
                                                    icon={<Security />}
                                                    label="Pending"
                                                    variant="outlined"
                                                />
                                            </Badge>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Badge
                                                badgeContent={
                                                    usersOverview.flagged
                                                }
                                                color="error"
                                            >
                                                <Chip
                                                    icon={<Flag />}
                                                    label="Flagged"
                                                    variant="outlined"
                                                />
                                            </Badge>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Jobs Overview Card */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Jobs Overview
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: "center", p: 1 }}>
                                            <Typography variant="h4">
                                                {jobsOverview.total}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Total Jobs
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: "center", p: 1 }}>
                                            <Typography variant="h4">
                                                {jobsOverview.active}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Active
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: "center", p: 1 }}>
                                            <Typography variant="h4">
                                                {jobsOverview.pending}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Pending
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: "center", p: 1 }}>
                                            <Typography variant="h4">
                                                {jobsOverview.closed}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Closed
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 2 }}>
                                    <Divider />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mt: 2,
                                        }}
                                    >
                                        <Typography variant="body2">
                                            <Flag
                                                fontSize="small"
                                                sx={{
                                                    color: "error.main",
                                                    mr: 0.5,
                                                    verticalAlign: "middle",
                                                }}
                                            />
                                            Reported Jobs:{" "}
                                            {jobsOverview.reported}
                                        </Typography>
                                        <Button size="small" variant="outlined">
                                            View All Jobs
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Recent Users Table */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h6">
                                        Recent Users
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="text"
                                        onClick={() => setTabValue(1)}
                                    >
                                        View All
                                    </Button>
                                </Box>
                                <TableContainer>
                                    <Table
                                        size="small"
                                        aria-label="recent users table"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>User</TableCell>
                                                <TableCell>Email</TableCell>
                                                <TableCell>Role</TableCell>
                                                <TableCell>Join Date</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="right">
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {recentUsers.map((user) => (
                                                <TableRow key={user.id} hover>
                                                    <TableCell>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Avatar
                                                                src={
                                                                    user.avatar
                                                                }
                                                                sx={{
                                                                    width: 30,
                                                                    height: 30,
                                                                    mr: 1,
                                                                }}
                                                            />
                                                            {user.name}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.email}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={getRoleIcon(
                                                                user.role
                                                            )}
                                                            label={
                                                                user.role
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                user.role.slice(
                                                                    1
                                                                )
                                                            }
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.joinDate}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={
                                                                user.status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                user.status.slice(
                                                                    1
                                                                )
                                                            }
                                                            size="small"
                                                            color={getStatusColor(
                                                                user.status
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            size="small"
                                                            aria-label="verify user"
                                                        >
                                                            <CheckCircle fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            aria-label="block user"
                                                            sx={{ mx: 0.5 }}
                                                        >
                                                            <Block fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            aria-label="delete user"
                                                        >
                                                            <DeleteOutline fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        {/* Recent Reports */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h6">
                                        Recent Reports
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="text"
                                        onClick={() => setTabValue(3)}
                                    >
                                        View All
                                    </Button>
                                </Box>
                                <TableContainer>
                                    <Table
                                        size="small"
                                        aria-label="recent reports table"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Subject</TableCell>
                                                <TableCell>
                                                    Reported Entity
                                                </TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="right">
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {recentReports.map((report) => (
                                                <TableRow key={report.id} hover>
                                                    <TableCell>
                                                        {report.type}
                                                    </TableCell>
                                                    <TableCell>
                                                        {report.subject}
                                                    </TableCell>
                                                    <TableCell>
                                                        {report.reportedUser ||
                                                            report.reportedJob}
                                                    </TableCell>
                                                    <TableCell>
                                                        {report.date}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={
                                                                report.status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                report.status.slice(
                                                                    1
                                                                )
                                                            }
                                                            size="small"
                                                            color={
                                                                report.status ===
                                                                "pending"
                                                                    ? "warning"
                                                                    : "success"
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            size="small"
                                                            aria-label="resolve report"
                                                        >
                                                            <CheckCircle fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            aria-label="delete report"
                                                        >
                                                            <DeleteOutline fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {/* Other tabs would be implemented here */}
                {tabValue === 1 && (
                    <Typography variant="h6">
                        Users Management Tab Content
                    </Typography>
                )}
                {tabValue === 2 && (
                    <Typography variant="h6">
                        Jobs Management Tab Content
                    </Typography>
                )}
                {tabValue === 3 && (
                    <Typography variant="h6">
                        Reports Management Tab Content
                    </Typography>
                )}
                {tabValue === 4 && (
                    <Typography variant="h6">Settings Tab Content</Typography>
                )}
            </Container>
        );
    };

export default AdminDashboard;
