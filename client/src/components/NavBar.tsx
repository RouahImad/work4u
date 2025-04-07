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
    Divider,
    useScrollTrigger,
    Slide,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Home,
    Work,
    Dashboard,
    Logout,
    NightsStayRounded as DarkIcon,
    LightMode as LightIcon,
    Person,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

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
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    // Hide navbar on scroll down, show on scroll up
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            logout();
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

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <AppBar
                position="sticky"
                color="default"
                elevation={0}
                sx={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: darkMode
                        ? "rgba(18, 18, 18, 0.8)"
                        : "rgba(255, 255, 255, 0.8)",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ py: 0.5 }}>
                        {/* Logo for larger screens */}
                        <Typography
                            variant="h5"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 3,
                                display: { xs: "none", md: "flex" },
                                fontWeight: 700,
                                color: "inherit",
                                textDecoration: "none",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    position: "relative",
                                    fontFamily: "Montserrat, sans-serif",
                                }}
                            >
                                Work
                                <Box
                                    component="span"
                                    sx={{
                                        fontFamily: "Pacifico, cursive",
                                        color: "rgb(255, 80, 80)",
                                        ml: 0.5,
                                        position: "relative",
                                        display: "inline-block",
                                    }}
                                >
                                    4U
                                </Box>
                            </Box>
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
                                sx={{
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 1,
                                }}
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
                                    mt: 1,
                                }}
                                PaperProps={{
                                    elevation: 3,
                                    sx: {
                                        borderRadius: 2,
                                        minWidth: 180,
                                        overflow: "visible",
                                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.12))",
                                    },
                                }}
                            >
                                <MenuItem
                                    component={Link}
                                    to="/"
                                    onClick={handleCloseNavMenu}
                                    selected={isRouteActive("/")}
                                    sx={{
                                        borderRadius: 1,
                                        mx: 1,
                                        my: 0.5,
                                        px: 2,
                                        color: isRouteActive("/")
                                            ? theme.palette.primary.main
                                            : "inherit",
                                        "&.Mui-selected": {
                                            backgroundColor: `${theme.palette.primary.main}10`,
                                        },
                                    }}
                                >
                                    <Home sx={{ mr: 1, fontSize: "1.2rem" }} />
                                    <Typography>Home</Typography>
                                </MenuItem>

                                {(userRole === "employee" ||
                                    userRole === "admin") && (
                                    <MenuItem
                                        component={Link}
                                        to="/jobs"
                                        onClick={handleCloseNavMenu}
                                        selected={isRouteActive("/jobs")}
                                        sx={{
                                            borderRadius: 1,
                                            mx: 1,
                                            my: 0.5,
                                            px: 2,
                                            color: isRouteActive("/jobs")
                                                ? theme.palette.primary.main
                                                : "inherit",
                                            "&.Mui-selected": {
                                                backgroundColor: `${theme.palette.primary.main}10`,
                                            },
                                        }}
                                    >
                                        <Work
                                            sx={{ mr: 1, fontSize: "1.2rem" }}
                                        />
                                        <Typography>Jobs</Typography>
                                    </MenuItem>
                                )}

                                <MenuItem
                                    onClick={handleDashboardClick}
                                    selected={isDashboardActive()}
                                    sx={{
                                        borderRadius: 1,
                                        mx: 1,
                                        my: 0.5,
                                        px: 2,
                                        color: isDashboardActive()
                                            ? theme.palette.primary.main
                                            : "inherit",
                                        "&.Mui-selected": {
                                            backgroundColor: `${theme.palette.primary.main}10`,
                                        },
                                    }}
                                >
                                    <Dashboard
                                        sx={{ mr: 1, fontSize: "1.2rem" }}
                                    />
                                    <Typography>Dashboard</Typography>
                                </MenuItem>

                                <Divider sx={{ my: 1 }} />

                                <MenuItem
                                    onClick={handleLogout}
                                    sx={{
                                        borderRadius: 1,
                                        mx: 1,
                                        my: 0.5,
                                        px: 2,
                                        color: theme.palette.error.main,
                                    }}
                                >
                                    <Logout
                                        sx={{ mr: 1, fontSize: "1.2rem" }}
                                    />
                                    <Typography>Logout</Typography>
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
                            <span
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
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
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Button
                                component={Link}
                                to="/"
                                onClick={handleCloseNavMenu}
                                startIcon={<Home />}
                                sx={{
                                    display: "flex",
                                    color: isRouteActive("/")
                                        ? theme.palette.primary.main
                                        : "inherit",
                                    fontWeight: 500,
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    backgroundColor: isRouteActive("/")
                                        ? `${theme.palette.primary.main}08`
                                        : "transparent",
                                    "&:hover": {
                                        backgroundColor: `${theme.palette.primary.main}12`,
                                    },
                                }}
                            >
                                Home
                            </Button>

                            {(userRole === "employee" ||
                                userRole === "admin") && (
                                <Button
                                    component={Link}
                                    to="/jobs"
                                    onClick={handleCloseNavMenu}
                                    startIcon={<Work />}
                                    sx={{
                                        display: "flex",
                                        color: isRouteActive("/jobs")
                                            ? theme.palette.primary.main
                                            : "inherit",
                                        fontWeight: 500,
                                        borderRadius: 2,
                                        px: 2,
                                        py: 1,
                                        backgroundColor: isRouteActive("/jobs")
                                            ? `${theme.palette.primary.main}08`
                                            : "transparent",
                                        "&:hover": {
                                            backgroundColor: `${theme.palette.primary.main}12`,
                                        },
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
                                    display: "flex",
                                    color: isDashboardActive()
                                        ? theme.palette.primary.main
                                        : "inherit",
                                    fontWeight: 500,
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    backgroundColor: isDashboardActive()
                                        ? `${theme.palette.primary.main}08`
                                        : "transparent",
                                    "&:hover": {
                                        backgroundColor: `${theme.palette.primary.main}12`,
                                    },
                                }}
                            >
                                Dashboard
                            </Button>
                        </Box>

                        {/* Right side buttons */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <motion.div whileTap={{ scale: 0.9 }}>
                                <Tooltip
                                    title={
                                        darkMode ? "Light mode" : "Dark mode"
                                    }
                                    arrow
                                >
                                    <IconButton
                                        onClick={() => setDarkMode(!darkMode)}
                                        sx={{
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 1.5,
                                            width: 40,
                                            height: 40,
                                        }}
                                    >
                                        {darkMode ? (
                                            <LightIcon
                                                sx={{ color: "#ffcc00" }}
                                            />
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

                            {/* User menu - visible on desktop */}
                            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                                <Tooltip title="Account settings" arrow>
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                        <IconButton
                                            onClick={handleOpenUserMenu}
                                            sx={{
                                                p: 0,
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 1.5,
                                                width: 40,
                                                height: 40,
                                            }}
                                        >
                                            <Person />
                                        </IconButton>
                                    </motion.div>
                                </Tooltip>
                                <Menu
                                    id="user-menu"
                                    anchorEl={anchorElUser}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                    onClick={handleCloseUserMenu}
                                    transformOrigin={{
                                        horizontal: "right",
                                        vertical: "top",
                                    }}
                                    anchorOrigin={{
                                        horizontal: "right",
                                        vertical: "bottom",
                                    }}
                                    PaperProps={{
                                        elevation: 3,
                                        sx: {
                                            mt: 1.5,
                                            borderRadius: 2,
                                            minWidth: 180,
                                            overflow: "visible",
                                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.12))",
                                            "&:before": {
                                                content: '""',
                                                display: "block",
                                                position: "absolute",
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: "background.paper",
                                                transform:
                                                    "translateY(-50%) rotate(45deg)",
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem
                                        onClick={handleLogout}
                                        sx={{ color: theme.palette.error.main }}
                                    >
                                        <Logout
                                            sx={{ mr: 1.5, fontSize: "1.2rem" }}
                                        />
                                        <Typography>Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>

                            {/* Logout button - visible on mobile */}
                            <Box sx={{ display: { xs: "flex", md: "none" } }}>
                                <Tooltip title="Logout" arrow>
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                        <IconButton
                                            onClick={handleLogout}
                                            sx={{
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 1.5,
                                                width: 40,
                                                height: 40,
                                            }}
                                        >
                                            <Logout />
                                        </IconButton>
                                    </motion.div>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </Slide>
    );
};

export default NavBar;
