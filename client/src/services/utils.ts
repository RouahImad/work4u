import { format } from "date-fns";

export const formatDate = (dateString: string, withHours = false) => {
    try {
        if (withHours) {
            return format(new Date(dateString), "MMM dd, yyyy HH:mm");
        }
        return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
        return "Invalid date";
    }
};
