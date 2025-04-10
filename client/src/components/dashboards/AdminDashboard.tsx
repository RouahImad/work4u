import { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Tab,
    Tabs,
    CircularProgress,
    Alert,
} from "@mui/material";
import {
    SupervisorAccount,
    Person,
    Flag,
    WorkOutline,
    AccountCircle,
} from "@mui/icons-material";
import { useDashboard } from "../../contexts/DashboardContext";
import ReportsTable from "./reports/ReportsTable";
import JobsManagement from "./jobs/JobsManagement";
import UsersManagement from "./users/UsersManagement";
import AdminProfile from "./profile/AdminProfile";
import AdminOverviewTab from "./admin/AdminOverviewTab";

const AdminDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const { adminStats, loading, error, fetchAdminStats } = useDashboard();

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const handleTabChange = (newValue: number) => {
        setTabValue(newValue);
    };

    const handleViewAllJobsClick = () => {
        setTabValue(2);
    };

    const handleViewAllReportsClick = () => {
        setTabValue(3);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Admin Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Manage users, jobs, and platform
                </Typography>
            </Box>

            {/* Dashboard navigation */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_e, newValue) => handleTabChange(newValue)}
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
                        icon={<AccountCircle />}
                        iconPosition="start"
                        label="Profile"
                    />
                </Tabs>
            </Box>

            {tabValue !== 0 && loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <>
                    {/* Overview Tab */}
                    {tabValue === 0 && (
                        <AdminOverviewTab
                            adminStats={adminStats}
                            onViewAllJobsClick={handleViewAllJobsClick}
                            onViewAllReportsClick={handleViewAllReportsClick}
                        />
                    )}

                    {/* Users Management Tab */}
                    {tabValue === 1 && (
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            {adminStats?.users?.list && (
                                <UsersManagement
                                    users={adminStats.users.list}
                                />
                            )}
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

                    {/* Profile Tab */}
                    {tabValue === 4 && <AdminProfile />}
                </>
            )}
        </Container>
    );
};

export default AdminDashboard;
