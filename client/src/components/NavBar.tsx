import { useState } from "react";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    Tooltip,
    MenuItem,
    Theme,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Home,
    Work,
    Dashboard,
    Logout,
    NightsStayRounded as DarkIcon,
    LightMode as LightIcon,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext"; // Import auth context
import { useNotification } from "../components/notifications/SlideInNotifications"; // Import notification hook

interface NavBarProps {
    userRole: string;
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
    theme: Theme;
    onLogout?: () => void;
}

const NavBar = ({
    userRole,
    darkMode,
    setDarkMode,
    theme,
    onLogout,
}: NavBarProps) => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth(); // Get the logout function from auth context
    const { pushNotification } = useNotification(); // Get notification function

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLogout = () => {
        // First, check if a custom logout handler was provided
        if (onLogout) {
            onLogout();
        } else {
            // Use the auth context's logout function
            logout();

            // Show logout notification

            // Redirect to login page
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        }
    };

    const handleDashboardClick = () => {
        switch (userRole) {
            case "employee":
                navigate("/employee/dashboard");
                break;
            case "employer":
                navigate("/employer/dashboard");
                break;
            case "admin":
                navigate("/admin/dashboard");
                break;
            default:
                navigate("/");
        }
        handleCloseNavMenu();
    };

    // Get dashboard route based on user role
    const getDashboardRoute = () => {
        switch (userRole) {
            case "employee":
                return "/employee/dashboard";
            case "employer":
                return "/employer/dashboard";
            case "admin":
                return "/admin/dashboard";
            default:
                return "/";
        }
    };

    // Check if route is active
    const isRouteActive = (path: string) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    // Check if dashboard route is active
    const isDashboardActive = () => {
        const dashboardPath = getDashboardRoute();
        return location.pathname.startsWith(dashboardPath);
    };

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo for larger screens */}
                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontWeight: 700,
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                            Work
                        </span>
                        <span
                            style={{
                                fontFamily: "Pacifico, cursive",
                                color: "#FF5050",
                            }}
                        >
                            4U
                        </span>
                    </Typography>

                    {/* Mobile menu */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            <MenuItem
                                component={Link}
                                to="/"
                                onClick={handleCloseNavMenu}
                                selected={isRouteActive("/")}
                                sx={{
                                    color: isRouteActive("/")
                                        ? theme.palette.primary.main
                                        : "inherit",
                                    "&.Mui-selected": {
                                        backgroundColor: `${theme.palette.primary.main}10`,
                                    },
                                }}
                            >
                                <Typography textAlign="center">Home</Typography>
                            </MenuItem>

                            {(userRole === "employee" ||
                                userRole === "admin") && (
                                <MenuItem
                                    component={Link}
                                    to="/jobs"
                                    onClick={handleCloseNavMenu}
                                    selected={isRouteActive("/jobs")}
                                    sx={{
                                        color: isRouteActive("/jobs")
                                            ? theme.palette.primary.main
                                            : "inherit",
                                        "&.Mui-selected": {
                                            backgroundColor: `${theme.palette.primary.main}10`,
                                        },
                                    }}
                                >
                                    <Typography textAlign="center">
                                        Jobs
                                    </Typography>
                                </MenuItem>
                            )}

                            <MenuItem
                                onClick={handleDashboardClick}
                                selected={isDashboardActive()}
                                sx={{
                                    color: isDashboardActive()
                                        ? theme.palette.primary.main
                                        : "inherit",
                                    "&.Mui-selected": {
                                        backgroundColor: `${theme.palette.primary.main}10`,
                                    },
                                }}
                            >
                                <Typography textAlign="center">
                                    Dashboard
                                </Typography>
                            </MenuItem>

                            {/* Add logout to mobile menu */}
                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    color: "inherit",
                                }}
                            >
                                <Typography textAlign="center">
                                    Logout
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                    {/* Logo for mobile */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontWeight: 700,
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                            Work
                        </span>
                        <span
                            style={{
                                fontFamily: "Pacifico, cursive",
                                color: theme.palette.secondary.main,
                            }}
                        >
                            4U
                        </span>
                    </Typography>

                    {/* Desktop menu */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        <Button
                            component={Link}
                            to="/"
                            onClick={handleCloseNavMenu}
                            startIcon={<Home />}
                            sx={{
                                my: 2,
                                display: "flex",
                                mr: 1,
                                color: isRouteActive("/")
                                    ? theme.palette.primary.main
                                    : "inherit",
                            }}
                        >
                            Home
                        </Button>

                        {(userRole === "employee" || userRole === "admin") && (
                            <Button
                                component={Link}
                                to="/jobs"
                                onClick={handleCloseNavMenu}
                                startIcon={<Work />}
                                sx={{
                                    my: 2,
                                    display: "flex",
                                    mr: 1,
                                    color: isRouteActive("/jobs")
                                        ? theme.palette.primary.main
                                        : "inherit",
                                }}
                            >
                                Jobs
                            </Button>
                        )}

                        <Button
                            component={Link}
                            to={getDashboardRoute()}
                            onClick={handleCloseNavMenu}
                            startIcon={<Dashboard />}
                            sx={{
                                my: 2,
                                display: "flex",
                                color: isDashboardActive()
                                    ? theme.palette.primary.main
                                    : "inherit",
                            }}
                        >
                            Dashboard
                        </Button>
                    </Box>

                    {/* Right side buttons */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <motion.div whileTap={{ scale: 0.9 }}>
                            <Tooltip
                                title={darkMode ? "Light mode" : "Dark mode"}
                            >
                                <IconButton
                                    onClick={() => setDarkMode(!darkMode)}
                                    sx={{ mr: 1 }}
                                >
                                    {darkMode ? (
                                        <LightIcon sx={{ color: "#ffcc00" }} />
                                    ) : (
                                        <DarkIcon
                                            sx={{
                                                color: theme.palette.primary
                                                    .main,
                                            }}
                                        />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </motion.div>

                        <Tooltip title="Logout">
                            <motion.div whileTap={{ scale: 0.9 }}>
                                <IconButton
                                    onClick={handleLogout}
                                    color="inherit"
                                >
                                    <Logout />
                                </IconButton>
                            </motion.div>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default NavBar;
