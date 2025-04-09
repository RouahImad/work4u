import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const LoadingAnimation = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: isDarkMode
                    ? "rgba(18, 18, 18, 0.8)"
                    : "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(4px)",
                zIndex: 9999,
                willChange: "opacity",
            }}
        >
            <Typography
                variant="body1"
                sx={{
                    mt: 2,
                    fontWeight: 500,
                    color: "text.secondary",
                    animation: "pulse 1s infinite ease-in-out",
                    "@keyframes pulse": {
                        "0%": { opacity: 0.6 },
                        "50%": { opacity: 1 },
                        "100%": { opacity: 0.6 },
                    },
                }}
            >
                Loading...
            </Typography>
        </Box>
    );
};

export default LoadingAnimation;
