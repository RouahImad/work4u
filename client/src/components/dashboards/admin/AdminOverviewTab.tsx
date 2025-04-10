import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    Chip,
    Badge,
    Divider,
    Card,
    CardContent,
    Skeleton,
    Alert,
} from "@mui/material";
import {
    Person,
    Flag,
    WorkOutline,
    AttachMoney,
    Description,
    QuestionAnswer,
    AssignmentInd,
    CheckCircle,
    Visibility,
} from "@mui/icons-material";
import ReportsTable from "../reports/ReportsTable";
import { AdminDashboardStats } from "../../../types/Stats.types";

// Define props interface for AdminOverviewTab
interface AdminOverviewTabProps {
    adminStats: AdminDashboardStats | null;
    loading?: boolean;
    error?: string | null;
    onViewAllJobsClick: () => void;
    onViewAllReportsClick: () => void;
}

const AdminOverviewTab = ({
    adminStats,
    loading = false,
    error = null,
    onViewAllJobsClick,
    onViewAllReportsClick,
}: AdminOverviewTabProps) => {
    // If loading or adminStats is null, show loading skeleton UI
    if (loading || !adminStats) {
        return (
            <Grid container spacing={3}>
                {/* Users Overview Card Skeleton */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 3,
                            height: "100%",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                    >
                        <Skeleton variant="text" width="40%" height={40} />
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            {[...Array(4)].map((_, index) => (
                                <Grid item xs={6} sm={3} key={index}>
                                    <Box sx={{ textAlign: "center", p: 1 }}>
                                        <Skeleton
                                            variant="text"
                                            height={40}
                                            width="70%"
                                            sx={{ mx: "auto" }}
                                        />
                                        <Skeleton
                                            variant="text"
                                            height={20}
                                            width="90%"
                                            sx={{ mx: "auto" }}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Skeleton
                                variant="rectangular"
                                height={1}
                                sx={{ mb: 2 }}
                            />
                            <Grid container spacing={2}>
                                {[...Array(3)].map((_, index) => (
                                    <Grid item xs={4} key={index}>
                                        <Skeleton
                                            variant="rectangular"
                                            height={32}
                                            sx={{ borderRadius: 16 }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {/* Jobs Overview Card Skeleton */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 3,
                            height: "100%",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                    >
                        <Skeleton variant="text" width="40%" height={40} />
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            {[...Array(4)].map((_, index) => (
                                <Grid item xs={6} sm={3} key={index}>
                                    <Box sx={{ textAlign: "center", p: 1 }}>
                                        <Skeleton
                                            variant="text"
                                            height={40}
                                            width="70%"
                                            sx={{ mx: "auto" }}
                                        />
                                        <Skeleton
                                            variant="text"
                                            height={20}
                                            width="90%"
                                            sx={{ mx: "auto" }}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Skeleton
                                variant="rectangular"
                                height={1}
                                sx={{ mb: 2 }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Skeleton variant="text" width="40%" />
                                <Skeleton
                                    variant="rectangular"
                                    width={120}
                                    height={36}
                                    sx={{ borderRadius: 1 }}
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        );
    }

    // If there's an error, show error message
    if (error) {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Button
                        variant="contained"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Refresh Dashboard
                    </Button>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={3}>
            {/* Users Overview Card */}
            <Grid item xs={12} md={6}>
                <Paper
                    sx={{
                        p: 3,
                        height: "100%",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <Typography variant="h6" fontWeight="500" gutterBottom>
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
                                <Typography variant="h4" color="primary.main">
                                    {adminStats?.users?.total || 0}
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
                                <Typography variant="h4" color="text.secondary">
                                    {adminStats?.cvs?.total || 0}
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
                                <Typography variant="h4" color="success.main">
                                    {adminStats?.applications?.total || 0}
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
                                <Typography variant="h4" color="secondary.main">
                                    {adminStats?.interview_responses?.total ||
                                        0}
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
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={4}>
                                <Badge
                                    badgeContent={
                                        adminStats?.applications?.pending || 0
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
                                        adminStats?.applications?.accepted || 0
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
                                        adminStats?.reports?.total || 0
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
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <Typography variant="h6" fontWeight="500" gutterBottom>
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
                                <Typography variant="h4" color="primary.main">
                                    {adminStats?.posts?.total || 0}
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
                                <Typography variant="h4" color="success.main">
                                    {adminStats?.posts?.average_salaire
                                        ? Math.round(
                                              adminStats.posts.average_salaire
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
                                <Typography variant="h4" color="success.main">
                                    {adminStats?.interview_responses
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
                                <Typography variant="h4" color="success.main">
                                    {((adminStats?.applications?.accepted ||
                                        0) /
                                        Math.max(
                                            1,
                                            adminStats?.applications?.total || 1
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
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <AttachMoney
                                    fontSize="small"
                                    sx={{ color: "success.main", mr: 0.5 }}
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
                                onClick={onViewAllJobsClick}
                            >
                                View All Jobs
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Grid>

            {/* Recent Report Details */}
            <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        mb: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight="500">
                            Recent Reports
                        </Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={onViewAllReportsClick}
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
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <Typography variant="h6" fontWeight="500" gutterBottom>
                        Platform Activity
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                elevation={0}
                                sx={{
                                    bgcolor: "background.default",
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <Person
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        {adminStats?.users?.total || 0}
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
                                    bgcolor: "background.default",
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <WorkOutline
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        {adminStats?.posts?.total || 0}
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
                                    bgcolor: "background.default",
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <Description
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        {adminStats?.cvs?.total || 0}
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
                                    bgcolor: "background.default",
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <QuestionAnswer
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        {adminStats?.interview_responses
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
    );
};

export default AdminOverviewTab;
