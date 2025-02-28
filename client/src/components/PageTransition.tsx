import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import LogoAnimation from "./LogoAnimation";

const PageTransition = () => {
    const controls = useAnimationControls();
    const logoControls = useAnimationControls();

    useEffect(() => {
        const sequence = async () => {
            // First animate the motion.div
            await controls.start({
                x: "0%",
                y: "0%",
                transition: {
                    duration: 0.5,
                    ease: "easeInOut",
                },
            });

            // Then show and animate the logo
            await logoControls.start({ opacity: 1 });

            // Wait for logo animation (1.3s)
            await new Promise((resolve) => setTimeout(resolve, 1300));

            // Hide the logo
            await logoControls.start({ opacity: 0 });

            // Short delay before exit
            await new Promise((resolve) => setTimeout(resolve, 200));
        };

        sequence();
    }, [controls, logoControls]);

    return (
        <motion.div
            initial={{ x: "100%", y: "-100%" }}
            animate={controls}
            exit={{ x: "-100%", y: "100%" }}
            transition={{
                exit: {
                    duration: 0.3,
                    ease: "easeInOut",
                },
            }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "150%",
                height: "150%",
                background: "#8099E9",
                zIndex: 9999,
                transformOrigin: "top right",
            }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={logoControls}
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10000,
                }}
            >
                <LogoAnimation />
            </motion.div>
        </motion.div>
    );
};

export default PageTransition;
