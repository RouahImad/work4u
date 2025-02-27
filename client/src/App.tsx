import { useEffect, useState } from "react";
import Home from "./components/Home";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";

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
        }, 800);
        return () => clearTimeout(t);
    }, []);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
            primary: {
                main: "#8099E9", // Soft blue for main buttons, links, and highlights
            },
            secondary: {
                main: "#E99DCB", // Pink for accents, hover effects, and interactive elements
            },
            background: {
                default: darkMode ? "#171430" : "#FFFFFF", // Dark mode: navy, Light mode: white
                paper: darkMode ? "#1E1B3A" : "#F5F5F5", // Slightly lighter than default for cards/containers
            },
            text: {
                primary: darkMode ? "#FFFFFF" : "#171430", // White text on dark, navy text on light
                secondary: darkMode ? "#E99DCB" : "#8099E9", // Pink or blue for subtitles and hints
            },
        },
        typography: {
            fontFamily: "Poppins, sans-serif",
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <PageTransition key="transition" />
                ) : (
                    <Home
                        theme={theme}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                    />
                )}
            </AnimatePresence>
        </ThemeProvider>
    );
};

export default App;
