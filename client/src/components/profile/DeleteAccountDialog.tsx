import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    CircularProgress,
    IconButton,
    Alert,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../notifications/SlideInNotifications";

interface DeleteAccountDialogProps {
    open: boolean;
    onClose: () => void;
}

const DeleteAccountDialog = ({ open, onClose }: DeleteAccountDialogProps) => {
    const { deleteAccount } = useAuth();
    const { pushNotification } = useNotification();

    const [confirmText, setConfirmText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmText(e.target.value);
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);

        try {
            await deleteAccount();
        } catch (error: any) {
            pushNotification(
                error.response?.data?.detail || "Failed to delete account",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const isDeleteButtonDisabled = confirmText !== "DELETE" || isLoading;

    return (
        <Dialog
            open={open}
            onClose={!isLoading ? onClose : undefined}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                Delete Account
                {!isLoading && (
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    This action cannot be undone. All your data will be
                    permanently deleted.
                </Alert>

                <Typography variant="body1" gutterBottom>
                    Please type <b>DELETE</b> to confirm you want to delete your
                    account:
                </Typography>

                <TextField
                    fullWidth
                    value={confirmText}
                    onChange={handleConfirmChange}
                    placeholder="Type DELETE here"
                    disabled={isLoading}
                    onPaste={(e) => {
                        e.preventDefault();
                    }}
                    onCopy={(e) => {
                        e.preventDefault();
                    }}
                    onCut={(e) => {
                        e.preventDefault();
                    }}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleDeleteAccount}
                    variant="contained"
                    color="error"
                    disabled={isDeleteButtonDisabled}
                    startIcon={
                        isLoading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : null
                    }
                >
                    {isLoading ? "Deleting..." : "Delete Account"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteAccountDialog;
