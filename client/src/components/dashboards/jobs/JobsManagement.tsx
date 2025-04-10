import { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Avatar,
    Tooltip,
    useTheme,
    Grid,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import {
    Search,
    Clear,
    Delete,
    Work,
    Business,
    AttachMoney,
    CalendarToday,
    Visibility,
    Edit,
    Sort,
} from "@mui/icons-material";
import { useJobPost } from "../../../contexts/JobPostContext";
import { Job } from "../../../types/Job.types";
import JobView from "../../../components/jobs/JobView";
import UpdateJobDialog from "../../../components/jobs/UpdateJobDialog";
import { formatDate } from "../../../services/utils";
import { isAfter, parseISO } from "date-fns";

const JobsManagement = () => {
    const theme = useTheme();
    const { jobs, loading, error, fetchAllJobs, deleteJob } = useJobPost();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [sortBy, setSortBy] = useState<string>("");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [jobViewOpen, setJobViewOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [updateJobDialogOpen, setUpdateJobDialogOpen] = useState(false);

    // Load jobs when component mounts
    useEffect(() => {
        fetchAllJobs();
    }, [refreshTrigger]);

    // Filter and sort users when search term or sortBy changes
    useEffect(() => {
        if (!jobs) return;

        let filtered = jobs.filter(
            (job) =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                job.company_address
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                job.salaire.toString().includes(searchTerm) ||
                (job.uploaded_at
                    ? job.uploaded_at
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    : false)
        );

        if (sortBy) {
            filtered = filtered.sort((a, b) => {
                switch (sortBy) {
                    case "title":
                        return a.title.localeCompare(b.title);
                    case "company":
                        return a.company_name.localeCompare(b.company_name);
                    case "location":
                        return a.company_address.localeCompare(
                            b.company_address
                        );
                    case "salary":
                        return a.salaire - b.salaire;
                    case "date":
                        return (
                            new Date(a.uploaded_at || "").getTime() -
                            new Date(b.uploaded_at || "").getTime()
                        );
                    case "status":
                        const aStatus = isApplicationClosed(a);
                        const bStatus = isApplicationClosed(b);
                        return aStatus === bStatus ? 0 : aStatus ? 1 : -1;
                    default:
                        return 0;
                }
            });
        }

        setFilteredJobs(filtered);
        setPage(0); // Reset to first page when filtering or sorting
    }, [searchTerm, sortBy, jobs]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    // Handle sort change
    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortBy(event.target.value);
    };

    const openDeleteConfirm = (jobId: number) => {
        setSelectedJobId(jobId);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setSelectedJobId(null);
    };

    const handleDeleteConfirm = async () => {
        if (selectedJobId === null) return;

        try {
            await deleteJob(selectedJobId);
            setRefreshTrigger((prev) => prev + 1); // Trigger a refresh
        } catch (error) {
            console.error("Error deleting job:", error);
        } finally {
            setDeleteConfirmOpen(false);
            setSelectedJobId(null);
        }
    };

    // Function to handle viewing a job
    const handleViewJob = (job: Job) => {
        setSelectedJob(job);
        setJobViewOpen(true);
    };

    // Handle closing the job view dialog
    const handleJobViewClose = () => {
        setJobViewOpen(false);
    };

    // Handle job editing - now properly implemented
    const handleEditJob = (jobId: number) => {
        const jobToEdit = jobs.find((job) => job.id === jobId);
        if (jobToEdit) {
            setSelectedJob(jobToEdit);
            setSelectedJobId(jobId);
            setUpdateJobDialogOpen(true);
        }

        if (jobViewOpen) {
            setJobViewOpen(false);
        }
    };

    // Handle closing the update job dialog
    const handleUpdateJobDialogClose = () => {
        setUpdateJobDialogOpen(false);
    };

    // Check if application is closed
    const isApplicationClosed = (job: Job) => {
        try {
            const finalDate = parseISO(job.final_date);
            const today = new Date();
            return isAfter(today, finalDate);
        } catch (error) {
            return false;
        }
    };

    // Apply pagination
    const displayJobs = filteredJobs.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box>
            {/* Admin Stats Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{ bgcolor: "background.default", borderRadius: 2 }}
                    >
                        <CardContent sx={{ textAlign: "center" }}>
                            <Work
                                color="primary"
                                sx={{ fontSize: 40, mb: 1 }}
                            />
                            <Typography variant="h6">{jobs.length}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Jobs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{ bgcolor: "background.default", borderRadius: 2 }}
                    >
                        <CardContent sx={{ textAlign: "center" }}>
                            <Business
                                color="primary"
                                sx={{ fontSize: 40, mb: 1 }}
                            />
                            <Typography variant="h6">
                                {
                                    new Set(jobs.map((job) => job.company_name))
                                        .size
                                }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Companies
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{ bgcolor: "background.default", borderRadius: 2 }}
                    >
                        <CardContent sx={{ textAlign: "center" }}>
                            <AttachMoney
                                color="primary"
                                sx={{ fontSize: 40, mb: 1 }}
                            />
                            <Typography variant="h6">
                                {jobs.length > 0
                                    ? Math.round(
                                          jobs.reduce(
                                              (acc, job) =>
                                                  acc +
                                                  Number(job.salaire || 0),
                                              0
                                          ) / jobs.length
                                      )
                                    : 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Avg. Salary
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{ bgcolor: "background.default", borderRadius: 2 }}
                    >
                        <CardContent sx={{ textAlign: "center" }}>
                            <CalendarToday
                                color="primary"
                                sx={{ fontSize: 40, mb: 1 }}
                            />
                            <Typography variant="h6">
                                {
                                    jobs.filter(
                                        (job) => !isApplicationClosed(job)
                                    ).length
                                }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active Postings
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search Bar */}
            <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search jobs by title, company, description or location..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="clear search"
                                    onClick={clearSearch}
                                    edge="end"
                                    size="small"
                                >
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                        value={sortBy}
                        onChange={handleSortChange}
                        startAdornment={
                            <InputAdornment position="start">
                                <Sort />
                            </InputAdornment>
                        }
                        displayEmpty
                        renderValue={(selected) => {
                            if (selected === "") {
                                return <em>Sort by</em>;
                            }
                            return (
                                selected.charAt(0).toUpperCase() +
                                selected.slice(1)
                            );
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="title">Title</MenuItem>
                        <MenuItem value="company">Company</MenuItem>
                        <MenuItem value="location">Location</MenuItem>
                        <MenuItem value="salary">Salary</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Jobs Table */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <Paper
                    sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}
                >
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Job Title</TableCell>
                                    <TableCell>Company</TableCell>
                                    <TableCell
                                        sx={{
                                            display: {
                                                xs: "none",
                                                md: "table-cell",
                                            },
                                        }}
                                    >
                                        Location
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            display: {
                                                xs: "none",
                                                sm: "table-cell",
                                            },
                                        }}
                                    >
                                        Salary
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            display: {
                                                xs: "none",
                                                sm: "table-cell",
                                            },
                                        }}
                                    >
                                        Posted
                                    </TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayJobs.length > 0 ? (
                                    displayJobs.map((job) => {
                                        const applicationClosed =
                                            isApplicationClosed(job);

                                        return (
                                            <TableRow key={job.id} hover>
                                                <TableCell>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                mr: 1,
                                                                bgcolor: `${theme.palette.primary.main}20`,
                                                                color: theme
                                                                    .palette
                                                                    .primary
                                                                    .main,
                                                                width: 35,
                                                                height: 35,
                                                                display: {
                                                                    xs: "none",
                                                                    sm: "flex",
                                                                },
                                                            }}
                                                        >
                                                            <Work fontSize="small" />
                                                        </Avatar>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight="medium"
                                                        >
                                                            {job.title}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {job.company_name}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        display: {
                                                            xs: "none",
                                                            md: "table-cell",
                                                        },
                                                    }}
                                                >
                                                    {job.company_address}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        display: {
                                                            xs: "none",
                                                            sm: "table-cell",
                                                        },
                                                    }}
                                                >
                                                    {job.salaire || "N/A"}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        display: {
                                                            xs: "none",
                                                            sm: "table-cell",
                                                        },
                                                    }}
                                                >
                                                    {job.uploaded_at
                                                        ? formatDate(
                                                              job.uploaded_at
                                                          )
                                                        : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={
                                                            applicationClosed
                                                                ? "Closed"
                                                                : "Active"
                                                        }
                                                        color={
                                                            applicationClosed
                                                                ? "error"
                                                                : "success"
                                                        }
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "flex-end",
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <Tooltip title="View job details">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() =>
                                                                    handleViewJob(
                                                                        job
                                                                    )
                                                                }
                                                            >
                                                                <Visibility fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Edit job">
                                                            <IconButton
                                                                size="small"
                                                                color="secondary"
                                                                onClick={() =>
                                                                    handleEditJob(
                                                                        job.id
                                                                    )
                                                                }
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete job">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() =>
                                                                    openDeleteConfirm(
                                                                        job.id
                                                                    )
                                                                }
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            {searchTerm
                                                ? "No jobs match your search"
                                                : "No jobs found"}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={filteredJobs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this job posting? This
                        action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Job View Dialog */}
            {selectedJob && (
                <JobView
                    open={jobViewOpen}
                    onClose={handleJobViewClose}
                    jobId={selectedJob.id}
                    job={selectedJob}
                    onEdit={handleEditJob}
                />
            )}

            {/* Update Job Dialog */}
            {selectedJobId && selectedJob && (
                <UpdateJobDialog
                    open={updateJobDialogOpen}
                    onClose={handleUpdateJobDialogClose}
                    jobId={selectedJobId}
                    job={selectedJob}
                    viewInAdmin={true}
                />
            )}
        </Box>
    );
};

export default JobsManagement;
