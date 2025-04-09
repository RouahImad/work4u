import { useEffect, useState } from "react";
import { Fab, Zoom, useTheme } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    // const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const theme = useTheme();

    // Toggle visibility based on scroll position and direction
    useEffect(() => {
        let scrollTimeout: number;

        const handleScroll = () => {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;

            // Determine scroll direction
            const isScrollUp = scrollTop < lastScrollTop;
            // setIsScrollingUp(isScrollUp);
            setLastScrollTop(scrollTop);

            // Show button if scrolling up or if at bottom 20% of the page
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            const scrolledToBottom =
                scrollTop + clientHeight > scrollHeight * 0.8;

            setIsVisible((isScrollUp && scrollTop > 400) || scrolledToBottom);

            // Clear previous timeout to avoid excessive state updates
            clearTimeout(scrollTimeout);

            // Hide button after 2 seconds of no scrolling
            scrollTimeout = window.setTimeout(() => {
                if (!isScrollUp && !scrolledToBottom) {
                    setIsVisible(false);
                }
            }, 2000);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [lastScrollTop]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <Zoom in={isVisible}>
            <Fab
                color="primary"
                size="medium"
                aria-label="scroll back to top"
                onClick={scrollToTop}
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    zIndex: 1000,
                    boxShadow: theme.shadows[3],
                    "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                    },
                }}
            >
                <KeyboardArrowUp />
            </Fab>
        </Zoom>
    );
};

export default ScrollToTop;
