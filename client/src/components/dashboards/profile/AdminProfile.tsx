import { useState } from "react";
import {
    Grid,
    Paper,
    Box,
    Typography,
    Card,
    Avatar,
    Button,
} from "@mui/material";
import { SupervisorAccount, Settings } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import EditProfileDialog from "../../profile/EditProfileDialog ";
import ChangePasswordDialog from "../../profile/ChangePasswordDialog ";
import DeleteAccountDialog from "../../profile/DeleteAccountDialog ";
import { format } from "date-fns";

const AdminProfile = () => {
    const { user } = useAuth();
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

    // Dialog handlers
    const handleEditProfileOpen = () => setEditProfileOpen(true);
    const handleEditProfileClose = () => setEditProfileOpen(false);

    const handleChangePasswordOpen = () => setChangePasswordOpen(true);
    const handleChangePasswordClose = () => setChangePasswordOpen(false);

    const handleDeleteAccountOpen = () => setDeleteAccountOpen(true);
    const handleDeleteAccountClose = () => setDeleteAccountOpen(false);

    // Format date function
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch (error) {
            return "Invalid date";
        }
    };

    // Create a display name from user data
    const displayName = user ? `${user.first_name} ${user.last_name}` : "Admin";
    const userEmail = user?.email || "No email available";
    const joinDate = formatDate(user?.created_at);

    return (
        <Grid item xs={12}>
            <Paper
                sx={{
                    p: 0,
                    overflow: "hidden",
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
            >
                {/* Profile Header */}
                <Box
                    sx={{
                        p: 4,
                        bgcolor: "primary.main",
                        color: "white",
                        backgroundImage:
                            "linear-gradient(45deg, #673ab7 30%, #3f51b5 90%)",
                    }}
                >
                    <Typography variant="h5" fontWeight="500" gutterBottom>
                        Administrator Profile
                    </Typography>
                    <Typography variant="body2">
                        Manage your administrator account and settings
                    </Typography>
                </Box>

                {/* Profile Content */}
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: "100%",
                                    p: 2,
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 3,
                                        pb: 2,
                                        borderBottom: 1,
                                        borderColor: "divider",
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            mr: 2,
                                            bgcolor: "primary.main",
                                        }}
                                        alt={displayName}
                                        src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=random`}
                                    >
                                        <SupervisorAccount />
                                    </Avatar>
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                        >
                                            Administrator Information
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Your personal details
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Name
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        fontWeight="medium"
                                    >
                                        {displayName}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Email
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        fontWeight="medium"
                                    >
                                        {userEmail}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Username
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        fontWeight="medium"
                                    >
                                        {user?.username || "Not available"}
                                    </Typography>
                                </Box>
{/* 
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Account Created
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        fontWeight="medium"
                                    >
                                        {joinDate}
                                    </Typography>
                                </Box> */}

                                <Button
                                    variant="contained"
                                    size="medium"
                                    sx={{ mt: 1 }}
                                    onClick={handleEditProfileOpen}
                                    fullWidth
                                >
                                    Edit Profile
                                </Button>
                            </Card>
                        </Grid>

                        {/* Account settings card */}
                        <Grid item xs={12} md={6}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: "100%",
                                    p: 2,
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        mb: 3,
                                        pb: 2,
                                        borderBottom: 1,
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography variant="h6" component="div">
                                        Account Settings
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Manage your account security
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        p: 3,
                                        mb: 2,
                                        borderRadius: 2,
                                        bgcolor: "action.hover",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            mb: 2,
                                            flexDirection: {
                                                xs: "column",
                                                sm: "row",
                                            },
                                            justifyContent: "center",
                                            width: "100%",
                                            gap: 2,
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            onClick={handleChangePasswordOpen}
                                            sx={{
                                                whiteSpace: "nowrap",
                                                minWidth: {
                                                    xs: "100%",
                                                    sm: "auto",
                                                },
                                            }}
                                        >
                                            Change Password
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="medium"
                                            color="error"
                                            onClick={handleDeleteAccountOpen}
                                            sx={{
                                                whiteSpace: "nowrap",
                                                minWidth: {
                                                    xs: "100%",
                                                    sm: "auto",
                                                },
                                            }}
                                        >
                                            Delete Account
                                        </Button>
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        align="center"
                                    >
                                        Changing your password regularly helps
                                        keep your account secure
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        bgcolor: "background.default",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        gutterBottom
                                    >
                                        Administrator Role
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mt: 1,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                mr: 2,
                                                bgcolor: "primary.main",
                                            }}
                                        >
                                            <Settings />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1">
                                                System Administrator
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Full platform access
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Dialogs */}
            {editProfileOpen && (
                <EditProfileDialog
                    open={editProfileOpen}
                    onClose={handleEditProfileClose}
                />
            )}
            {changePasswordOpen && (
                <ChangePasswordDialog
                    open={changePasswordOpen}
                    onClose={handleChangePasswordClose}
                />
            )}
            {deleteAccountOpen && (
                <DeleteAccountDialog
                    open={deleteAccountOpen}
                    onClose={handleDeleteAccountClose}
                />
            )}
        </Grid>
    );
};

export default AdminProfile;
