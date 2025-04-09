import React, { Component, ReactNode } from "react";
import { Button, Box, Typography } from "@mui/material";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    handleRefresh = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                        textAlign: "center",
                        p: 3,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Something went wrong.
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                    >
                        Please try refreshing the page.
                    </Typography>
                    <Button
                        variant="text"
                        color="primary"
                        onClick={this.handleRefresh}
                        sx={{
                            textDecoration: "underline",
                            textTransform: "capitalize",
                            fontSize: "1rem",
                        }}
                    >
                        Refresh
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
