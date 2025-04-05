import { useEffect, useState } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
// import { AnimatePresence } from "framer-motion";
declare module "@mui/material/styles" {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        md: true;
        lg: true;
        xl: true;
        mobile: true;
    }
}
import AppRoutes from "./router/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import NotificationProvider from "./components/notifications/SlideInNotifications";

const isDarkMode = localStorage.getItem("darkMode") === "true" ? true : false;

const App = () => {
    const [darkMode, setDarkMode] = useState(isDarkMode);

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode ? "true" : "false");
    }, [darkMode]);

    const theme = createTheme({
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1536,
                mobile: 429,
            },
        },
        palette: {
            mode: darkMode ? "dark" : "light",
            primary: {
                main: "#9D4EDD", // Vibrant violet/purple as main color
                light: "#C77DFF",
                dark: "#7B2CBF",
            },
            secondary: {
                main: "#FF3C7F", // Electric magenta - looks great with purple
                light: "#FF7AA2",
                dark: "#CF1259",
            },
            background: {
                default: darkMode ? "#120025" : "#FFFFFF", // Dark mode: deep violet-black, Light mode: white
                paper: darkMode ? "#1E0038" : "#F9F1FF",
            },
            text: {
                primary: darkMode ? "#FFFFFF" : "#240046",
                secondary: darkMode ? "#E0AAFF" : "#7B2CBF",
            },
            success: {
                main: "#00E676",
                light: "#69F0AE",
                dark: "#00C853",
            },
            warning: {
                main: "#FF9E00",
                light: "#FFCF52",
                dark: "#E67700",
            },
            error: {
                main: "#FF2A6D",
                light: "#FF6B9D",
                dark: "#D1004B",
            },
            info: {
                main: "#05D9E8",
                light: "#65FDFF",
                dark: "#0099AB",
            },
        },

        typography: {
            fontFamily: "Poppins, sans-serif",
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                    },
                    containedPrimary: {
                        "&:hover": {
                            background:
                                "linear-gradient(45deg, #9D4EDD 30%, #C77DFF 90%)",
                            // "linear-gradient(45deg, #7B2CBF 30%, #9D4EDD 90%)",
                        },
                    },
                    containedSecondary: {
                        "&:hover": {
                            background:
                                "linear-gradient(45deg, #FF3C7F 30%, #FF7AA2 90%)",
                            // "linear-gradient(45deg, #CF1259 30%, #FF3C7F 90%)",
                        },
                    },
                },
            },
        },
    });

    //             main: "#4ECDC4", // Teal main color (similar to your gradient)
    //             light: "#8FF8EE",
    //             dark: "#2A9D8F",
    //             main: "#FF6B6B", // Complementary coral color for contrast
    //             light: "#FF9E9E",
    //             dark: "#D63447",
    //             main: "#2DD881", // Bright green that complements teal
    //             light: "#7DEFA9",
    //             dark: "#1DB954",
    //             main: "#FFD166", // Amber/yellow that works with teal
    //             light: "#FFE29D",
    //             dark: "#F4A261",
    //             main: "#EF476F", // Bright pink-red for errors
    //             light: "#FF7E9D",
    //             dark: "#D32F2F",
    //             main: "#118AB2", // Blue-teal for information
    //             light: "#55C1E3",
    //             dark: "#0C637A",

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <NotificationProvider>
                <AuthProvider>
                    <AppRoutes
                        theme={theme}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                    />
                </AuthProvider>
            </NotificationProvider>
        </ThemeProvider>
    );
};

export default App;
