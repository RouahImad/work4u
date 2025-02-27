import { motion } from "framer-motion";

const PageTransition = () => {
    return (
        <motion.div
            initial={{ x: "100%", y: "-100%" }}
            animate={{ x: "0%", y: "0%" }}
            exit={{ x: "-100%", y: "100%" }}
            transition={{
                animate: {
                    duration: 0.5,
                    ease: "easeInOut",
                },
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
        />
    );
};

export default PageTransition;
