import { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Tab,
    Tabs,
    Chip,
    Badge,
    Divider,
    CircularProgress,
    Alert,
    Card,
    CardContent,
} from "@mui/material";
import {
    SupervisorAccount,
    Person,
    Flag,
    WorkOutline,
    Settings,
    AttachMoney,
    Description,
    QuestionAnswer,
    AssignmentInd,
    CheckCircle,
    Visibility,
} from "@mui/icons-material";
import { useDashboard } from "../../contexts/DashboardContext";
import { format } from "date-fns";
import ReportsTable from "./reports/ReportsTable";
import JobsManagement from "./jobs/JobsManagement";

const AdminDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const { adminStats, loading, error, fetchAdminStats } = useDashboard();

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const handleTabChange = (newValue: number) => {
        setTabValue(newValue);
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
                    onChange={(e, newValue) => handleTabChange(newValue)}
                    aria-label="admin dashboard tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab
                        icon={<SupervisorAccount />}
                        iconPosition="start"
                        label="Overview"
                    />
                    <Tab icon={<Person />} iconPosition="start" label="Users" />
                    <Tab
                        icon={<WorkOutline />}
                        iconPosition="start"
                        label="Jobs"
                    />
                    <Tab icon={<Flag />} iconPosition="start" label="Reports" />
                    <Tab
                        icon={<Settings />}
                        iconPosition="start"
                        label="Settings"
                    />
                </Tabs>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <>
                    {tabValue === 0 && (
                        <Grid container spacing={3}>
                            {/* Users Overview Card */}
                            <Grid item xs={12} md={6}>
                                <Paper
                                    sx={{
                                        p: 3,
                                        height: "100%",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        Users Overview
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
                                                    {adminStats?.users?.total ||
                                                        0}
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
                                            <Box
                                                sx={{
                                                    textAlign: "center",
                                                    p: 1,
                                                }}
                                            >
                                                <Typography
                                                    variant="h4"
                                                    color="info.main"
                                                >
                                                    {adminStats?.cvs?.total ||
                                                        0}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    CV Documents
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
                                                    {adminStats?.applications
                                                        ?.total || 0}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Applications
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
                                                    color="secondary.main"
                                                >
                                                    {adminStats
                                                        ?.interview_responses
                                                        ?.total || 0}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Interviews
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ mt: 2 }}>
                                        <Divider />
                                        <Grid
                                            container
                                            spacing={2}
                                            sx={{ mt: 2 }}
                                        >
                                            <Grid item xs={4}>
                                                <Badge
                                                    badgeContent={
                                                        adminStats?.applications
                                                            ?.pending || 0
                                                    }
                                                    color="primary"
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
                                                        adminStats?.applications
                                                            ?.accepted || 0
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
                                                    badgeContent={
                                                        adminStats?.reports
                                                            ?.total || 0
                                                    }
                                                    color="error"
                                                    max={999}
                                                >
                                                    <Chip
                                                        icon={<Flag />}
                                                        label="Reports"
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
                                <Paper
                                    sx={{
                                        p: 3,
                                        height: "100%",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        Jobs Overview
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
                                                    {adminStats?.posts?.total ||
                                                        0}
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
                                                    {adminStats?.posts
                                                        ?.average_salaire
                                                        ? Math.round(
                                                              adminStats.posts
                                                                  .average_salaire
                                                          )
                                                        : 0}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Avg. Salary
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
                                                    color="info.main"
                                                >
                                                    {adminStats
                                                        ?.interview_responses
                                                        ?.average_score
                                                        ? adminStats.interview_responses.average_score.toFixed(
                                                              1
                                                          )
                                                        : 0}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Avg. Score
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
                                                    color="secondary.main"
                                                >
                                                    {((adminStats?.applications
                                                        ?.accepted || 0) /
                                                        Math.max(
                                                            1,
                                                            adminStats
                                                                ?.applications
                                                                ?.total || 1
                                                        )) *
                                                        100}
                                                    %
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Success Rate
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
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <AttachMoney
                                                    fontSize="small"
                                                    sx={{
                                                        color: "success.main",
                                                        mr: 0.5,
                                                    }}
                                                />
                                                <Typography variant="body2">
                                                    Average Salary:{" "}
                                                    {adminStats?.posts?.average_salaire?.toLocaleString() ||
                                                        0}
                                                </Typography>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<Visibility />}
                                                onClick={() => setTabValue(2)}
                                            >
                                                View All Jobs
                                            </Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Recent Report Details */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, borderRadius: 2 }}>
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
                                            variant="outlined"
                                            startIcon={<Visibility />}
                                            onClick={() => setTabValue(3)}
                                        >
                                            View All
                                        </Button>
                                    </Box>

                                    {adminStats?.reports?.details && (
                                        <ReportsTable
                                            reports={adminStats.reports.details}
                                            limit={5}
                                        />
                                    )}
                                </Paper>
                            </Grid>

                            {/* Platform Statistics */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Platform Activity
                                    </Typography>
                                    <Grid container spacing={3} sx={{ mt: 1 }}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Card
                                                elevation={0}
                                                sx={{
                                                    bgcolor:
                                                        "background.default",
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <CardContent
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    <Person
                                                        color="primary"
                                                        sx={{
                                                            fontSize: 40,
                                                            mb: 1,
                                                        }}
                                                    />
                                                    <Typography variant="h6">
                                                        {adminStats?.users
                                                            ?.total || 0}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Registered Users
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Card
                                                elevation={0}
                                                sx={{
                                                    bgcolor:
                                                        "background.default",
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <CardContent
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    <WorkOutline
                                                        color="primary"
                                                        sx={{
                                                            fontSize: 40,
                                                            mb: 1,
                                                        }}
                                                    />
                                                    <Typography variant="h6">
                                                        {adminStats?.posts
                                                            ?.total || 0}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Jobs Posted
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Card
                                                elevation={0}
                                                sx={{
                                                    bgcolor:
                                                        "background.default",
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <CardContent
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    <Description
                                                        color="primary"
                                                        sx={{
                                                            fontSize: 40,
                                                            mb: 1,
                                                        }}
                                                    />
                                                    <Typography variant="h6">
                                                        {adminStats?.cvs
                                                            ?.total || 0}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        CV Uploads
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Card
                                                elevation={0}
                                                sx={{
                                                    bgcolor:
                                                        "background.default",
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <CardContent
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    <QuestionAnswer
                                                        color="primary"
                                                        sx={{
                                                            fontSize: 40,
                                                            mb: 1,
                                                        }}
                                                    />
                                                    <Typography variant="h6">
                                                        {adminStats
                                                            ?.interview_responses
                                                            ?.total || 0}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Interviews Completed
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}

                    {/* Users Management Tab */}
                    {tabValue === 1 && (
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6">
                                Users Management Tab Content
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 2 }}
                            >
                                User management functionality will be
                                implemented here.
                            </Typography>
                        </Paper>
                    )}

                    {/* Jobs Management Tab */}
                    {tabValue === 2 && (
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Jobs Management
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    View, search and manage job postings
                                </Typography>
                            </Box>

                            <JobsManagement />
                        </Paper>
                    )}

                    {/* Reports Tab */}
                    {tabValue === 3 && (
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Reports Management
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    View and manage all user-submitted reports
                                </Typography>
                            </Box>

                            {adminStats?.reports?.details ? (
                                <ReportsTable
                                    reports={adminStats.reports.details}
                                    title="All Reports"
                                    showSearch={true}
                                />
                            ) : (
                                <Alert severity="info">
                                    No reports have been submitted yet
                                </Alert>
                            )}
                        </Paper>
                    )}

                    {/* Settings Tab */}
                    {tabValue === 4 && (
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6">
                                Settings Tab Content
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 2 }}
                            >
                                Platform settings and configuration options will
                                be implemented here.
                            </Typography>
                        </Paper>
                    )}
                </>
            )}
        </Container>
    );
};

export default AdminDashboard;
