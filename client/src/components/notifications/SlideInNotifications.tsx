import {
    useEffect,
    useState,
    createContext,
    useContext,
    ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, IconButton, styled } from "@mui/material";
import { CheckCircle, Error, Info, Warning, Close } from "@mui/icons-material";

const generateUniqueId = (() => {
    let counter = 0;
    return () => {
        const timestamp = Date.now();
        const uniqueId = `${timestamp}-${counter}`;
        counter += 1;
        return uniqueId;
    };
})();

// Define notification type
export type NotificationType = {
    id: string;
    text: string;
    type?: "success" | "error" | "info" | "warning";
};

// Create a styled component for notifications
const NotificationContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    width: "300px",
    position: "fixed",
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 9999,
    pointerEvents: "none",
}));

const NotificationItem = styled(motion.div, {
    shouldForwardProp: (prop) => prop !== "notificationType",
})<{ notificationType?: "success" | "error" | "info" | "warning" }>(
    ({ theme, notificationType }) => {
        const getBackgroundColor = () => {
            switch (notificationType) {
                case "success":
                    return theme.palette.success.main;
                case "error":
                    return theme.palette.error.main;
                case "warning":
                    return theme.palette.warning.main;
                case "info":
                default:
                    return theme.palette.primary.main;
            }
        };

        return {
            padding: theme.spacing(1),
            display: "flex",
            // alignItems: "flex-start",
            alignItems: "center",
            borderRadius: theme.shape.borderRadius,
            gap: theme.spacing(1),
            fontSize: "0.875rem",
            fontWeight: 500,
            boxShadow: theme.shadows[4],
            color: "#FFFFFF",
            backgroundColor: getBackgroundColor(),
            pointerEvents: "auto",
            minHeight: "40px",
        };
    }
);

// Create context for notifications
type NotificationContextType = {
    pushNotification: (
        message: string,
        type?: "success" | "error" | "info" | "warning"
    ) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

// Provider component
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const pushNotification = (
        message: string,
        type: "success" | "error" | "info" | "warning" = "success"
    ) => {
        const newNotification: NotificationType = {
            id: generateUniqueId(),
            text: message,
            type,
        };
        setNotifications((prev) => [newNotification, ...prev]);
    };

    return (
        <NotificationContext.Provider value={{ pushNotification }}>
            {children}
            <NotificationContainer>
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <NotificationComponent
                            key={notification.id}
                            notification={notification}
                            removeNotification={removeNotification}
                        />
                    ))}
                </AnimatePresence>
            </NotificationContainer>
        </NotificationContext.Provider>
    );
};

// Hook to use notifications
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new globalThis.Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};

// Default notification timeout
const NOTIFICATION_TTL = 50000; // 50 seconds

// Function to get the appropriate icon based on notification type
const getNotificationIcon = (
    type?: "success" | "error" | "info" | "warning"
) => {
    switch (type) {
        case "success":
            return <CheckCircle fontSize="small" />;
        case "error":
            return <Error fontSize="small" />;
        case "warning":
            return <Warning fontSize="small" />;
        case "info":
        default:
            return <Info fontSize="small" />;
    }
};

// Individual notification component
const NotificationComponent = ({
    notification,
    removeNotification,
}: {
    notification: NotificationType;
    removeNotification: (id: string) => void;
}) => {
    useEffect(() => {
        const timeoutRef = setTimeout(() => {
            removeNotification(notification.id);
        }, NOTIFICATION_TTL);

        return () => clearTimeout(timeoutRef);
    }, [notification.id, removeNotification]);

    return (
        <NotificationItem
            layout
            initial={{ y: -15, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            notificationType={notification.type}
        >
            {getNotificationIcon(notification.type)}
            <span>{notification.text}</span>
            <IconButton
                onClick={() => removeNotification(notification.id)}
                size="small"
                sx={{
                    ml: "auto",
                    color: "white",
                    p: 0,
                    height: 20,
                    width: 20,
                    mt: "1px",
                }}
            >
                <Close fontSize="small" />
            </IconButton>
        </NotificationItem>
    );
};

// Create a standalone function to show notifications
// This is a utility function that can be imported directly
export const showNotification = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success"
) => {
    const context = useContext(NotificationContext);
    if (!context) {
        console.error("NotificationContext is not available");
        return;
    }
    context.pushNotification(message, type);
};

export default NotificationProvider;
