/**
 * Utility functions for error handling
 */

/**
 * Sanitizes error messages from API responses to ensure they're user-friendly
 * and don't expose implementation details
 */
export const sanitizeErrorMessage = (
    error: any,
    defaultMessage: string
): string => {
    // If there's no error, return the default message
    if (!error) return defaultMessage;

    // If it's a network error
    if (error.message === "Network Error") {
        return "Unable to connect to the server. Please check your internet connection.";
    }

    // Extract the error message from the response if available
    const apiError = error.response?.data?.detail;

    // If we have an API error message
    if (apiError) {
        // Filter out sensitive information or technical details
        if (
            apiError.includes("INTERNAL SERVER ERROR") ||
            apiError.includes("500") ||
            apiError.includes("Exception") ||
            apiError.includes("stack trace") ||
            apiError.includes("SQL") ||
            apiError.includes("Database")
        ) {
            return "An unexpected error occurred. Please try again later.";
        }

        // Return sanitized API error
        return apiError;
    }

    // Return the default error message as fallback
    return defaultMessage;
};

/**
 * Logs errors to console while in development mode
 */
export const logError = (error: any, context: string): void => {
    if (import.meta.env.DEV) {
        console.error(`Error in ${context}:`, error);
    }
};
