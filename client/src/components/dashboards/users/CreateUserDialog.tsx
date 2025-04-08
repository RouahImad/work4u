import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    SelectChangeEvent,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import { useDashboard } from "../../../contexts/DashboardContext";
import { CreateUserDialogProps } from "../../../types/User.types";

const CreateUserDialog = ({ open, onClose }: CreateUserDialogProps) => {
    const { error, createUser } = useAuth();
    const { fetchAdminStats } = useDashboard();
    const [isLoading, setIsLoading] = useState(false);

    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "admin",
        first_name: "",
        last_name: "",
        company_name: "",
        company_address: "",
        company_website: "",
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleCreateInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | { name?: string; value: unknown }
        >
    ) => {
        const { name, value } = e.target as { name: string; value: string };
        setNewUser({
            ...newUser,
            [name]: value,
        });

        // Clear error for this field if user is typing
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: "",
            });
        }
    };

    // Add a specific handler for Select component
    const handleRoleChange = (event: SelectChangeEvent) => {
        const { name, value } = event.target;
        setNewUser({
            ...newUser,
            [name]: value,
        });

        // Clear error for this field if user is changing role
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: "",
            });
        }
    };

    const validateCreateForm = () => {
        const errors: Record<string, string> = {};

        if (!newUser.username.trim()) {
            errors.username = "Username is required";
        }

        if (!newUser.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
            errors.email = "Email is invalid";
        }

        if (!newUser.password) {
            errors.password = "Password is required";
        } else if (newUser.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        if (newUser.password !== newUser.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        if (!newUser.first_name.trim()) {
            errors.first_name = "First name is required";
        }

        if (!newUser.last_name.trim()) {
            errors.last_name = "Last name is required";
        }

        // Validate employer-specific fields if role is employer
        if (newUser.role === "employer") {
            if (!newUser.company_name.trim()) {
                errors.company_name = "Company name is required";
            }

            if (!newUser.company_address.trim()) {
                errors.company_address = "Company address is required";
            }

            if (
                newUser.company_website &&
                !newUser.company_website.trim().startsWith("http")
            ) {
                errors.company_website =
                    "Website should include http:// or https://";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateUser = async () => {
        if (!validateCreateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const userData = {
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                ...(newUser.role === "employer" && {
                    company_name: newUser.company_name,
                    company_address: newUser.company_address,
                    company_website: newUser.company_website,
                }),
            };

            const response = await createUser(userData);

            if (response && !error) {
                await fetchAdminStats();
                handleClose();
            }
        } catch (error) {
            console.error("Error creating user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setNewUser({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "admin",
                first_name: "",
                last_name: "",
                company_name: "",
                company_address: "",
                company_website: "",
            });
            setFormErrors({});
            onClose();
        }
    };

    const isEmployer = newUser.role === "employer";

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New User</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    Create a new user account with the following details. All
                    fields are required.
                </DialogContentText>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="first_name"
                            label="First Name"
                            fullWidth
                            value={newUser.first_name}
                            onChange={handleCreateInputChange}
                            error={Boolean(formErrors.first_name)}
                            helperText={formErrors.first_name}
                            margin="normal"
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="last_name"
                            label="Last Name"
                            fullWidth
                            value={newUser.last_name}
                            onChange={handleCreateInputChange}
                            error={Boolean(formErrors.last_name)}
                            helperText={formErrors.last_name}
                            margin="normal"
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="username"
                            label="Username"
                            fullWidth
                            value={newUser.username}
                            onChange={handleCreateInputChange}
                            error={Boolean(formErrors.username)}
                            helperText={formErrors.username}
                            margin="normal"
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            value={newUser.email}
                            onChange={handleCreateInputChange}
                            error={Boolean(formErrors.email)}
                            helperText={formErrors.email}
                            margin="normal"
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            value={newUser.password}
                            onChange={handleCreateInputChange}
                            error={Boolean(formErrors.password)}
                            helperText={formErrors.password}
                            margin="normal"
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            value={newUser.confirmPassword}
                            onChange={handleCreateInputChange}
                            error={Boolean(formErrors.confirmPassword)}
                            helperText={formErrors.confirmPassword}
                            margin="normal"
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="create-role-select-label">
                                Role
                            </InputLabel>
                            <Select
                                labelId="create-role-select-label"
                                id="create-role-select"
                                name="role"
                                value={newUser.role}
                                label="Role"
                                onChange={handleRoleChange}
                                disabled={isLoading}
                            >
                                <MenuItem value="employee">Employee</MenuItem>
                                <MenuItem value="employer">Employer</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                            <FormHelperText>
                                Select the appropriate role for this user
                            </FormHelperText>
                        </FormControl>
                    </Grid>

                    {/* Conditional company fields for employers */}
                    {isEmployer && (
                        <>
                            <Grid item xs={12}>
                                <TextField
                                    name="company_name"
                                    label="Company Name"
                                    fullWidth
                                    value={newUser.company_name}
                                    onChange={handleCreateInputChange}
                                    error={Boolean(formErrors.company_name)}
                                    helperText={formErrors.company_name}
                                    margin="normal"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="company_address"
                                    label="Company Address"
                                    fullWidth
                                    value={newUser.company_address}
                                    onChange={handleCreateInputChange}
                                    error={Boolean(formErrors.company_address)}
                                    helperText={formErrors.company_address}
                                    margin="normal"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="company_website"
                                    label="Company Website (include http:// or https://)"
                                    fullWidth
                                    value={newUser.company_website}
                                    onChange={handleCreateInputChange}
                                    error={Boolean(formErrors.company_website)}
                                    helperText={formErrors.company_website}
                                    margin="normal"
                                    placeholder="https://example.com"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleCreateUser}
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                >
                    {isLoading ? <>Creating...</> : "Create User"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateUserDialog;
