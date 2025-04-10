import {
    Box,
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
    Chip,
    LinearProgress,
    Badge,
    Skeleton,
    Alert,
} from "@mui/material";
import { Fragment } from "react";
import {
    Schedule,
    TrendingUp,
    QuestionAnswer,
    AssignmentInd,
    CheckCircle,
    BarChart,
    School,
    WorkOutline,
    Person,
    Visibility,
    AccessTime,
} from "@mui/icons-material";
import { EmployeeDashboardStats } from "../../../types/Stats.types";
import { formatDate } from "../../../services/utils";

// Define props interface
interface OverviewTabProps {
    employeeStats: EmployeeDashboardStats | null;
    loading: boolean;
    error: string | null;
    setActiveTab: (tab: string) => void;
    handleInterviewStart: (applicationId: number, postTitle: string) => void;
}

const OverviewTab = ({
    employeeStats,
    loading,
    error,
    setActiveTab,
    handleInterviewStart,
}: OverviewTabProps) => {
    // If loading or employeeStats is null, show loading skeleton UI
    if (loading || !employeeStats) {
        return (
            <Grid container spacing={3}>
                {/* Top Row - Overview Stats Skeleton */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 3,
                            height: "100%",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
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
                                height={60}
                                sx={{ mt: 2 }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Progress Skeleton */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            height: "100%",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                    >
                        <Skeleton variant="text" width="60%" height={40} />
                        {[...Array(4)].map((_, index) => (
                            <Box key={index} sx={{ mb: 3, mt: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                    }}
                                >
                                    <Skeleton variant="text" width="40%" />
                                    <Skeleton variant="text" width="20%" />
                                </Box>
                                <Skeleton
                                    variant="rectangular"
                                    height={8}
                                    sx={{ borderRadius: 4 }}
                                />
                            </Box>
                        ))}
                        <Skeleton
                            variant="rectangular"
                            height={40}
                            sx={{ mt: 2, borderRadius: 1 }}
                        />
                    </Paper>
                </Grid>

                {/* Activity Summary Skeleton */}
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            mb: 2,
                        }}
                    >
                        <Skeleton variant="text" width="30%" height={40} />
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            {[...Array(4)].map((_, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            bgcolor: "background.default",
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Box sx={{ p: 3, textAlign: "center" }}>
                                            <Skeleton
                                                variant="circular"
                                                width={60}
                                                height={60}
                                                sx={{ mx: "auto", mb: 2 }}
                                            />
                                            <Skeleton
                                                variant="text"
                                                height={30}
                                                width="50%"
                                                sx={{ mx: "auto" }}
                                            />
                                            <Skeleton
                                                variant="text"
                                                height={20}
                                                width="80%"
                                                sx={{ mx: "auto" }}
                                            />
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>

                {/* Activity and Events Row Skeleton */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 3,
                            mb: { xs: 3, md: 0 },
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            height: "100%",
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
                            <Skeleton variant="text" width="40%" height={35} />
                            <Skeleton
                                variant="rectangular"
                                width={80}
                                height={30}
                                sx={{ borderRadius: 1 }}
                            />
                        </Box>
                        {[...Array(5)].map((_, i) => (
                            <Fragment key={i}>
                                <Skeleton
                                    variant="rectangular"
                                    height={70}
                                    sx={{ mb: 1, borderRadius: 1 }}
                                />
                            </Fragment>
                        ))}
                    </Paper>
                </Grid>

                {/*  Events Skeleton */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            height: "100%",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Skeleton variant="text" width="60%" height={35} />
                        </Box>
                        {[...Array(3)].map((_, i) => (
                            <Fragment key={i}>
                                <Skeleton
                                    variant="rectangular"
                                    height={70}
                                    sx={{ mb: 1, borderRadius: 1 }}
                                />
                            </Fragment>
                        ))}
                    </Paper>
                </Grid>

                {/* Bottom Row Skeleton */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            height: "100%",
                        }}
                    >
                        <Skeleton
                            variant="text"
                            width="50%"
                            height={35}
                            sx={{ mb: 2 }}
                        />
                        {[...Array(3)].map((_, i) => (
                            <Fragment key={i}>
                                <Skeleton
                                    variant="rectangular"
                                    height={90}
                                    sx={{ mb: 1, borderRadius: 1 }}
                                />
                            </Fragment>
                        ))}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            height: "100%",
                        }}
                    >
                        <Skeleton
                            variant="text"
                            width="50%"
                            height={35}
                            sx={{ mb: 2 }}
                        />
                        {[...Array(3)].map((_, i) => (
                            <Fragment key={i}>
                                <Skeleton
                                    variant="rectangular"
                                    height={90}
                                    sx={{ mb: 1, borderRadius: 1 }}
                                />
                            </Fragment>
                        ))}
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
                        variant="text"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Refresh Dashboard
                    </Button>
                </Grid>
            </Grid>
        );
    }

    // Pre-calculate frequently used values for better null safety
    const applicationCount = employeeStats?.applications?.length || 0;
    const interviewCount = employeeStats?.interview_history?.length || 0;
    const averageScore = employeeStats?.average_score || 0;
    const acceptedCount =
        employeeStats?.applications?.filter((app) => app.status === "accepte")
            .length || 0;
    const pendingCount = applicationCount - acceptedCount;

    // Calculate interview percentage safely
    const interviewPercentage =
        applicationCount > 0
            ? Math.min(100, (interviewCount / applicationCount) * 100)
            : 0;

    // Helper function for safely accessing applications array
    const getSafeApplications = () => {
        return employeeStats?.applications || [];
    };

    // Helper function for safely accessing interview history
    const getSafeInterviewHistory = () => {
        return employeeStats?.interview_history || [];
    };

    // Helper function to check if an interview deadline has passed
    const hasInterviewDeadlinePassed = (
        finalDate: string | undefined
    ): boolean => {
        if (!finalDate) return false;
        const deadline = new Date(finalDate);
        const today = new Date();
        return deadline < today;
    };

    return (
        <Grid
            container
            spacing={3}
            sx={{
                mx: "auto",
            }}
        >
            {/* Top Row - Overview Stats and Progress */}
            <Grid item xs={12} md={8}>
                <Paper
                    sx={{
                        p: 3,
                        height: "100%",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    <Typography variant="h6" fontWeight="500" gutterBottom>
                        Career Overview
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
                                    {applicationCount}
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
                                <Typography variant="h4" color="text.secondary">
                                    {interviewCount}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Interviews
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
                                <Typography variant="h4" color="warning.main">
                                    {pendingCount}
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
                            <Box
                                sx={{
                                    textAlign: "center",
                                    p: 1,
                                }}
                            >
                                <Typography variant="h4" color="success.main">
                                    {acceptedCount}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Accepted
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                        <Divider />
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={4}>
                                <Badge
                                    badgeContent={pendingCount}
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
                                    badgeContent={acceptedCount}
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
                                    badgeContent={interviewCount}
                                    color="info"
                                    max={999}
                                >
                                    <Chip
                                        icon={<QuestionAnswer />}
                                        label="Interviews"
                                        variant="outlined"
                                    />
                                </Badge>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
                <Paper
                    sx={{
                        p: 3,
                        height: "100%",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    <Typography variant="h6" fontWeight="500" gutterBottom>
                        Application Progress
                    </Typography>

                    <Box sx={{ mb: 3, mt: 2 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" fontWeight="medium">
                                Application Status
                            </Typography>
                            <Typography variant="body2">
                                {applicationCount} Total
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={100}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                            }}
                            color="primary"
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" fontWeight="medium">
                                Interview Completion
                            </Typography>
                            <Typography variant="body2">
                                {interviewPercentage.toFixed(0)}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={interviewPercentage}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                            }}
                            color="secondary"
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" fontWeight="medium">
                                Success Rate
                            </Typography>
                            <Typography variant="body2">
                                {applicationCount > 0
                                    ? (
                                          (acceptedCount / applicationCount) *
                                          100
                                      ).toFixed(0)
                                    : "0"}
                                %
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={
                                applicationCount > 0
                                    ? (acceptedCount / applicationCount) * 100
                                    : 0
                            }
                            sx={{
                                height: 8,
                                borderRadius: 4,
                            }}
                            color="success"
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" fontWeight="medium">
                                Average Score
                            </Typography>
                            <Typography variant="body2">
                                {averageScore.toFixed(1)}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={averageScore}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                            }}
                            color="warning"
                        />
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => setActiveTab("applications")}
                        fullWidth
                        sx={{ mt: 1 }}
                    >
                        View All Applications
                    </Button>
                </Paper>
            </Grid>

            {/* Middle Row - Activity Summary */}
            <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        mb: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight="500" gutterBottom>
                        Application Activity
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
                                    <WorkOutline
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        {applicationCount}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Total Applications
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
                                    <Person
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        {acceptedCount}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Accepted Offers
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
                                    <School
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        {interviewCount}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Completed Interviews
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
                                    <BarChart
                                        color="primary"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        {averageScore.toFixed(1)}%
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Average Score
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* Activity and Events Row */}
            <Grid item xs={12} md={8}>
                <Paper
                    sx={{
                        p: 3,
                        mb: { xs: 3, md: 0 },
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        height: "100%",
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
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <TrendingUp color="primary" sx={{ mr: 1 }} />
                            <Typography
                                variant="h6"
                                fontWeight="500"
                                component="div"
                            >
                                Recent Activity
                            </Typography>
                        </Box>
                        <Button
                            size="small"
                            onClick={() => setActiveTab("applications")}
                            variant="text"
                        >
                            View All
                        </Button>
                    </Box>

                    <List sx={{ width: "100%" }}>
                        {getSafeInterviewHistory().length > 0 ? (
                            getSafeInterviewHistory()
                                .slice(0, 5)
                                .map((interview) => (
                                    <Fragment key={interview.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`Interviewed for ${interview.post_title}`}
                                                secondary={`Score: ${
                                                    interview.score
                                                        ? interview.score.toFixed(
                                                              1
                                                          )
                                                        : 0
                                                }%`}
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </Fragment>
                                ))
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

            <Grid item xs={12} md={4}>
                <Paper
                    sx={{
                        p: 3,
                        height: "100%",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Schedule color="primary" sx={{ mr: 1 }} />
                        <Typography
                            variant="h6"
                            fontWeight="500"
                            component="div"
                        >
                            Events
                        </Typography>
                    </Box>
                    <List dense>
                        {getSafeApplications().length > 0 ? (
                            getSafeApplications()
                                .filter((app) => app.status !== "accepte")
                                .slice(0, 3)
                                .map((app, index: number) => (
                                    <Fragment key={index}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`Applied for ${app.post_title}`}
                                                secondary={`Application: ${formatDate(
                                                    app.application_date
                                                )}`}
                                            />
                                            {app.interview_id === 0 && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() =>
                                                        handleInterviewStart(
                                                            app.application_id,
                                                            app.post_title
                                                        )
                                                    }
                                                >
                                                    Take Interview
                                                </Button>
                                            )}
                                        </ListItem>
                                        <Divider component="li" />
                                    </Fragment>
                                ))
                        ) : (
                            <ListItem>
                                <ListItemText
                                    primary="No events"
                                    secondary="Events will appear here when scheduled"
                                />
                            </ListItem>
                        )}
                    </List>
                </Paper>
            </Grid>

            {/* Bottom Row - Interview History and Pending Applications */}
            <Grid item xs={12} md={5}>
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        height: "100%",
                    }}
                >
                    <Typography variant="h6" fontWeight="500" gutterBottom>
                        Interview History
                    </Typography>
                    {getSafeInterviewHistory().length > 0 ? (
                        <List>
                            {getSafeInterviewHistory()
                                .slice(0, 3)
                                .map((interview) => {
                                    const isExpired =
                                        hasInterviewDeadlinePassed(
                                            interview.final_date
                                        );

                                    return (
                                        <Fragment key={interview.id}>
                                            <ListItem>
                                                <Box sx={{ width: "100%" }}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "flex-start",
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <Typography variant="subtitle1">
                                                            {
                                                                interview.post_title
                                                            }
                                                        </Typography>

                                                        {isExpired && (
                                                            <Chip
                                                                size="small"
                                                                label="Deadline Passed"
                                                                color="default"
                                                                icon={
                                                                    <AccessTime fontSize="small" />
                                                                }
                                                                sx={{
                                                                    fontSize:
                                                                        "0.7rem",
                                                                    bgcolor:
                                                                        "#9e9e9e",
                                                                    color: "white",
                                                                }}
                                                            />
                                                        )}

                                                        <Chip
                                                            size="small"
                                                            label={`Score: ${
                                                                interview.score ||
                                                                0
                                                            }%`}
                                                            color={
                                                                interview.score !==
                                                                    null &&
                                                                interview.score >=
                                                                    70
                                                                    ? "success"
                                                                    : "warning"
                                                            }
                                                        />
                                                    </Box>

                                                    {interview.final_date && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ mb: 1 }}
                                                        >
                                                            Deadline:{" "}
                                                            {formatDate(
                                                                interview.final_date
                                                            )}
                                                        </Typography>
                                                    )}

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {Array.isArray(
                                                            interview.question
                                                        ) &&
                                                        interview.question
                                                            .length > 0
                                                            ? `${
                                                                  interview
                                                                      .question
                                                                      .length
                                                              } question${
                                                                  interview
                                                                      .question
                                                                      .length >
                                                                  1
                                                                      ? "s"
                                                                      : ""
                                                              } answered`
                                                            : "No questions recorded"}
                                                    </Typography>
                                                </Box>
                                            </ListItem>
                                            <Divider component="li" />
                                        </Fragment>
                                    );
                                })}
                            {getSafeInterviewHistory().length > 3 && (
                                <Box sx={{ textAlign: "center", mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            setActiveTab("applications")
                                        }
                                    >
                                        View More
                                    </Button>
                                </Box>
                            )}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No interviews completed yet.
                        </Typography>
                    )}
                </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        // height: "100%",
                    }}
                >
                    <Typography variant="h6" fontWeight="500" gutterBottom>
                        Pending Applications
                    </Typography>
                    {getSafeApplications().filter(
                        (app) => app.status === "en_attente"
                    ).length > 0 ? (
                        <List>
                            {getSafeApplications()
                                .filter((app) => app.status === "en_attente")
                                .slice(0, 3)
                                .map((app, index: number) => {
                                    // Find if this application has a linked interview
                                    const linkedInterview = app.interview_id
                                        ? getSafeInterviewHistory().find(
                                              (interview) =>
                                                  interview.id ===
                                                  app.interview_id
                                          )
                                        : null;

                                    // Check if interview deadline has passed
                                    const deadlinePassed = linkedInterview
                                        ? hasInterviewDeadlinePassed(
                                              linkedInterview.final_date
                                          )
                                        : false;

                                    return (
                                        <Fragment key={index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Typography variant="body1">
                                                                {app.post_title}
                                                            </Typography>
                                                            {deadlinePassed && (
                                                                <Chip
                                                                    size="small"
                                                                    label="Deadline Passed"
                                                                    color="default"
                                                                    icon={
                                                                        <AccessTime fontSize="small" />
                                                                    }
                                                                    sx={{
                                                                        fontSize:
                                                                            "0.7rem",
                                                                        bgcolor:
                                                                            "#9e9e9e",
                                                                        color: "white",
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    }
                                                    secondary={`Applied on: ${formatDate(
                                                        app.application_date,
                                                        true
                                                    )}`}
                                                />
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        handleInterviewStart(
                                                            app.application_id,
                                                            app.post_title
                                                        )
                                                    }
                                                    disabled={deadlinePassed}
                                                    sx={{
                                                        px: {
                                                            xs: 3,
                                                            sm: 2,
                                                        },
                                                        borderRadius: 1.5,
                                                        whiteSpace: "nowrap",
                                                        alignSelf: "flex-end",
                                                        color: "#333",
                                                        borderColor:
                                                            "currentcolor",
                                                        backgroundColor:
                                                            "#E0F7FA",
                                                        textTransform:
                                                            "capitalize",
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    {deadlinePassed
                                                        ? "Expired"
                                                        : "Start Interview"}
                                                </Button>
                                            </ListItem>
                                            <Divider component="li" />
                                        </Fragment>
                                    );
                                })}
                            {getSafeApplications().filter(
                                (app) => app.status === "en_attente"
                            ).length > 3 && (
                                <Box sx={{ textAlign: "center", mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            setActiveTab("applications")
                                        }
                                    >
                                        View More
                                    </Button>
                                </Box>
                            )}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No pending applications requiring interviews.
                        </Typography>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default OverviewTab;
