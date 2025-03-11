import { useEffect, useState } from "react";
// import Home from "./components/Home";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
// import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import AppRoutes from "./components/AppRoutes";

const isDarkMode = localStorage.getItem("darkMode") === "true" ? true : false;

const App = () => {
    const [darkMode, setDarkMode] = useState(isDarkMode);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode ? "true" : "false");
    }, [darkMode]);

    useEffect(() => {
        // Simulate initial page load
        const t = setTimeout(() => {
            setIsLoading(false);
        }, 2400);
        return () => clearTimeout(t);
    }, []);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
            primary: {
                main: "#4ECDC4", // Teal main color (similar to your gradient)
                light: "#8FF8EE",
                dark: "#2A9D8F",
            },
            secondary: {
                main: "#FF6B6B", // Complementary coral color for contrast
                light: "#FF9E9E",
                dark: "#D63447",
            },
            background: {
                default: darkMode ? "#1A2E35" : "#FFFFFF", // Dark mode: deep teal-gray, Light mode: white
                paper: darkMode ? "#253C45" : "#F5FFFC", // Slightly lighter than default with teal tint
            },
            text: {
                primary: darkMode ? "#FFFFFF" : "#1A3A32", // White text on dark, deep teal text on light
                secondary: darkMode ? "#A7E9E0" : "#2A9D8F", // Light teal or darker teal for subtitles
            },
            success: {
                main: "#2DD881", // Bright green that complements teal
                light: "#7DEFA9",
                dark: "#1DB954",
            },
            warning: {
                main: "#FFD166", // Amber/yellow that works with teal
                light: "#FFE29D",
                dark: "#F4A261",
            },
            error: {
                main: "#EF476F", // Bright pink-red for errors
                light: "#FF7E9D",
                dark: "#D32F2F",
            },
            info: {
                main: "#118AB2", // Blue-teal for information
                light: "#55C1E3",
                dark: "#0C637A",
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
                        // background:
                        //     "linear-gradient(45deg, #4ECDC4 30%, #8FF8EE 90%)",
                        "&:hover": {
                            background:
                                "linear-gradient(45deg, #2A9D8F 30%, #4ECDC4 90%)",
                        },
                    },
                    containedSecondary: {
                        // background:
                        //     "linear-gradient(45deg, #FF6B6B 30%, #FF9E9E 90%)",
                        "&:hover": {
                            background:
                                "linear-gradient(45deg, #D63447 30%, #FF6B6B 90%)",
                        },
                    },
                },
            },
        },
    });
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {isLoading ? (
                <PageTransition />
            ) : (
                <AppRoutes
                    theme={theme}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    isAuthenticated={false}
                    userRole=""
                />
            )}
        </ThemeProvider>
    );
};

export default App;
