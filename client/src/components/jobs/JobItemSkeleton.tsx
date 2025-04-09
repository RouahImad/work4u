import {
    Box,
    Divider,
    Grid,
    Paper,
    Skeleton,
    CardContent,
} from "@mui/material";

/**
 * A skeleton loading component for job items
 * Used as a placeholder while job data is being fetched
 */
const JobItemSkeleton = () => {
    return (
        <Paper
            elevation={1}
            sx={{
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            <CardContent sx={{ p: 0 }}>
                <Box
                    sx={{
                        p: 3,
                        borderLeft: `5px solid rgba(0, 0, 0, 0.08)`,
                    }}
                >
                    {/* Header section skeleton */}
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 2,
                                }}
                            >
                                <Skeleton
                                    variant="circular"
                                    width={40}
                                    height={40}
                                    sx={{ display: { xs: "none", sm: "flex" } }}
                                />
                                <Box sx={{ width: "100%" }}>
                                    <Skeleton
                                        variant="text"
                                        width="70%"
                                        height={32}
                                    />
                                    <Skeleton
                                        variant="text"
                                        width="50%"
                                        height={20}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    justifyContent: {
                                        xs: "flex-start",
                                        md: "flex-end",
                                    },
                                }}
                            >
                                <Skeleton
                                    variant="rounded"
                                    width={80}
                                    height={24}
                                />
                                <Skeleton
                                    variant="rounded"
                                    width={120}
                                    height={24}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Description skeleton */}
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />

                    {/* Footer skeleton */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                        }}
                    >
                        <Skeleton variant="text" width={100} />
                        <Skeleton variant="rounded" width={110} height={30} />
                    </Box>
                </Box>
            </CardContent>
        </Paper>
    );
};

export default JobItemSkeleton;
