import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Chip,
    Paper,
    Alert,
    Tooltip,
    Avatar,
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
    PersonAdd,
    VerifiedUser,
    Sort,
} from "@mui/icons-material";
import { useDashboard } from "../../../contexts/DashboardContext";
import { useNotification } from "../../../components/notifications/SlideInNotifications";
import CreateUserDialog from "./CreateUserDialog";
import { useAuth } from "../../../contexts/AuthContext";
import { UserBase, UsersManagementProps } from "../../../types/User.types";

const UsersManagement = ({ users }: UsersManagementProps) => {
    // State variables
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<UserBase[]>(users || []);
    const [sortBy, setSortBy] = useState<string>("");

    // State for create user dialog
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    // State for delete confirmation dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserBase | null>(null);

    // State for verification
    const [verifyingUserId, setVerifyingUserId] = useState<number | null>(null);

    // Access dashboard context
    const { error, deleteUser, verifyUser } = useAuth();
    const { fetchAdminStats } = useDashboard();
    const { pushNotification } = useNotification();

    // Filter and sort users when search term or sortBy changes
    useEffect(() => {
        if (!users) return;

        let filtered = users.filter(
            (user) =>
                user.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered = filtered.sort((a, b) => {
            if (sortBy === "username") {
                return a.username.localeCompare(b.username);
            } else if (sortBy === "email") {
                return a.email.localeCompare(b.email);
            } else if (sortBy === "role") {
                return a.role.localeCompare(b.role);
            } else if (sortBy === "verified") {
                return a.verified === b.verified ? 0 : a.verified ? -1 : 1;
            }
            return 0;
        });

        setFilteredUsers(filtered);
        setPage(0); // Reset to first page when filtering or sorting
    }, [searchTerm, sortBy, users]);

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Clear search term
    const clearSearch = () => {
        setSearchTerm("");
    };

    // Handle sort change
    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortBy(event.target.value);
    };

    // Handle pagination
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Create user dialog handlers
    const handleCreateDialogOpen = () => {
        setCreateDialogOpen(true);
    };

    const handleCreateDialogClose = () => {
        setCreateDialogOpen(false);
    };

    // Delete user handlers
    const handleDeleteDialogOpen = (user: UserBase) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await deleteUser(userToDelete.id);
            if (!error) {
                await fetchAdminStats();
                handleDeleteDialogClose();
            }
        } catch (error: any) {
            console.error("Error deleting user:", error);
        }
    };

    // Verify user handler
    const handleVerifyUser = async (userId: number) => {
        setVerifyingUserId(userId);
        try {
            await verifyUser(userId);

            // Optimistically update the local state for immediate UI feedback
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, verified: true } : user
                )
            );

            // Then fetch the updated data from server
            if (!error) {
                await fetchAdminStats();
            }
        } catch (error) {
            console.error("Error verifying user:", error);
            // Display the error to the user
            pushNotification?.(
                "Failed to verify user. Please try again.",
                "error"
            );
        } finally {
            setVerifyingUserId(null);
        }
    };

    // Render role chip with appropriate styling
    const renderRoleChip = (role: string) => {
        let color:
            | "default"
            | "primary"
            | "secondary"
            | "error"
            | "info"
            | "success"
            | "warning" = "default";

        switch (role.toLowerCase()) {
            case "admin":
                color = "error";
                break;
            case "employer":
                color = "primary";
                break;
            case "employee":
                color = "success";
                break;
            default:
                color = "default";
        }

        return (
            <Chip
                label={role}
                color={color}
                size="small"
                sx={{
                    color: color !== "default" ? "white" : undefined,
                    backgroundColor: role === "admin" ? "#f44336 " : undefined,
                }}
            />
        );
    };

    // Apply pagination
    const displayUsers = filteredUsers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box>
            {/* Header with title and create button */}
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Users Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View, create, and delete user accounts
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={handleCreateDialogOpen}
                    sx={{
                        whiteSpace: "nowrap",
                    }}
                >
                    Create User
                </Button>
            </Box>
            {/* Search Bar and Sort By */}
            <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search users by name, email, role..."
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
                        <MenuItem value="username">Username</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="role">Role</MenuItem>
                        <MenuItem value="verified">Verified</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {/* Users Table */}
            <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Verified</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayUsers.length > 0 ? (
                                displayUsers.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        mr: 2,
                                                        width: 40,
                                                        height: 40,
                                                        bgcolor: `${
                                                            user.role ===
                                                            "admin"
                                                                ? "#f44336"
                                                                : user.role ===
                                                                  "employer"
                                                                ? "#3f51b5"
                                                                : "#4caf50"
                                                        }40`,
                                                        color:
                                                            user.role ===
                                                            "admin"
                                                                ? "#f44336"
                                                                : user.role ===
                                                                  "employer"
                                                                ? "#3f51b5"
                                                                : "#4caf50",
                                                    }}
                                                >
                                                    {user.username[0].toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight="medium"
                                                    >
                                                        {user.username}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {renderRoleChip(user.role)}
                                        </TableCell>
                                        <TableCell>
                                            {user.verified ? (
                                                <Chip
                                                    label="Verified"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor:
                                                            "rgba(76, 175, 80, 0.2)",
                                                        color: "#4CAF50",
                                                    }}
                                                />
                                            ) : (
                                                <Chip
                                                    label="Not Verified"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor:
                                                            "rgba(255, 193, 7, 0.3)",
                                                        color: "#EF6C00",
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                <Tooltip title="Verify User">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() =>
                                                                handleVerifyUser(
                                                                    user.id
                                                                )
                                                            }
                                                            disabled={
                                                                user.verified ||
                                                                verifyingUserId ===
                                                                    user.id
                                                            }
                                                        >
                                                            {verifyingUserId ===
                                                            user.id ? (
                                                                <CircularProgress
                                                                    size={20}
                                                                />
                                                            ) : (
                                                                <VerifiedUser fontSize="small" />
                                                            )}
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>

                                                <Tooltip title="Delete User">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            handleDeleteDialogOpen(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        {searchTerm
                                            ? "No users match your search"
                                            : "No users found"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {/* Create User Dialog */}
            {createDialogOpen && (
                <CreateUserDialog
                    open={createDialogOpen}
                    onClose={handleCreateDialogClose}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {deleteDialogOpen && (
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete the user{" "}
                            <strong>{userToDelete?.username}</strong>? This
                            action cannot be undone and all data associated with
                            this user will be permanently deleted.
                        </DialogContentText>
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            This is a destructive action that will remove all of
                            the user's data from the system.
                        </Alert>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteUser}
                            color="error"
                            variant="contained"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default UsersManagement;
