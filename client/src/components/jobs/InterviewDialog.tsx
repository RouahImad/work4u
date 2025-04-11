import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    CircularProgress,
    LinearProgress,
    Alert,
    IconButton,
    Paper,
    Chip,
    Grid,
    Dialog as ConfirmationDialog,
    DialogContentText,
} from "@mui/material";
import {
    Close,
    Timer,
    CheckCircleOutline,
    Assignment,
    HelpOutline,
    VisibilityOff,
} from "@mui/icons-material";
import { useCVInterview } from "../../contexts/CVInterviewContext";
import { useNotification } from "../notifications/SlideInNotifications";

interface InterviewDialogProps {
    open: boolean;
    onClose: () => void;
    postTitle: string;
    applicationId: number;
    interviewTime?: number; // Time in minutes for the interview
}

const InterviewDialog: React.FC<InterviewDialogProps> = ({
    open,
    onClose,
    postTitle,
    applicationId,
    interviewTime = 30, // Default interview time: 30 minutes
}) => {
    const {
        questions,
        loading,
        error,
        generateQuestions,
        submitResponses,
        evaluateInterview,
    } = useCVInterview();
    const { pushNotification } = useNotification();

    // Interview state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [interviewCompleted, setInterviewCompleted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [interviewSuccess, setInterviewSuccess] = useState(false);
    const [terminateDialogOpen, setTerminateDialogOpen] = useState(false); // State for termination confirmation dialog

    // Focus tracking state
    const [unfocusTimestamp, setUnfocusTimestamp] = useState<number | null>(
        null
    );
    const [penaltySeconds, setPenaltySeconds] = useState(0);
    const [showUnfocusedWarning, setShowUnfocusedWarning] = useState(false);
    const [lastPenaltyTime, setLastPenaltyTime] = useState(0);
    const UNFOCUS_PENALTY_SECONDS = 360; // 6 minutes (360 seconds) penalty for each unfocus event
    const PENALTY_COOLDOWN_MS = 5000; // 5 seconds cooldown between penalties
    const unfocusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Timer state
    const [timeRemaining, setTimeRemaining] = useState(interviewTime * 60); // Convert minutes to seconds
    const [timerActive, setTimerActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // State to hold transformed questions with answers
    const [transformedQuestions, setTransformedQuestions] = useState<
        { question: string; answer: string }[]
    >([]);

    // Load questions when dialog opens
    useEffect(() => {
        if (open && !interviewStarted && !interviewCompleted) {
            loadQuestions();
        }
    }, [open]);

    useEffect(() => {
        if (questions.length > 0) {
            const formattedQuestions = questions.map((q) => ({
                question: q,
                answer: "",
            }));
            setTransformedQuestions(formattedQuestions);
        }
    }, [questions]);

    // Track page visibility
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!interviewStarted || interviewCompleted) return;

            const isHidden = document.hidden;
            const currentTime = Date.now();

            if (isHidden) {
                // User switched tabs or minimized window
                setUnfocusTimestamp(currentTime);

                unfocusTimeoutRef.current = setTimeout(() => {
                    setShowUnfocusedWarning(true);
                }, 400);
            } else {
                setShowUnfocusedWarning(false);

                if (unfocusTimestamp) {
                    // Check if enough time has passed since the last penalty
                    const timeSinceLastPenalty = currentTime - lastPenaltyTime;

                    if (timeSinceLastPenalty > PENALTY_COOLDOWN_MS) {
                        // Apply time penalty (6 minutes per switch)
                        const newPenalty = UNFOCUS_PENALTY_SECONDS;
                        setPenaltySeconds((prev) => prev + newPenalty);
                        setTimeRemaining((prev) =>
                            Math.max(0, prev - newPenalty)
                        );

                        // Update the last penalty time
                        setLastPenaltyTime(currentTime);

                        // Show notification about the penalty
                        pushNotification(
                            `Leaving the interview window reduces your time. ${Math.floor(
                                newPenalty / 60
                            )} minutes deducted.`,
                            "warning"
                        );
                    } else {
                        // Show a different notification for rapid switching
                        pushNotification(
                            "Rapid tab switching detected. Please stay focused on the interview.",
                            "error"
                        );
                    }

                    setUnfocusTimestamp(null);
                }

                // Clear the warning timeout if it exists
                if (unfocusTimeoutRef.current) {
                    clearTimeout(unfocusTimeoutRef.current);
                }
            }
        };

        // Add visibility change event listener
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

            if (unfocusTimeoutRef.current) {
                clearTimeout(unfocusTimeoutRef.current);
            }
        };
    }, [
        interviewStarted,
        interviewCompleted,
        unfocusTimestamp,
        UNFOCUS_PENALTY_SECONDS,
        lastPenaltyTime,
        PENALTY_COOLDOWN_MS,
    ]);

    // Timer logic
    useEffect(() => {
        if (timerActive && timeRemaining > 0) {
            timerRef.current = setTimeout(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timerActive && timeRemaining === 0) {
            // Time's up - submit whatever is completed
            handleSubmitInterview();
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [timerActive, timeRemaining]);

    // Format time remaining as MM:SS
    const formatTimeRemaining = () => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    // Calculate time progress percentage
    const timeProgressPercentage = () => {
        return (
            ((interviewTime * 60 - timeRemaining) / (interviewTime * 60)) * 100
        );
    };

    // Load questions from API
    const loadQuestions = async () => {
        try {
            await generateQuestions(applicationId);
        } catch (error) {
            console.error("Failed to load interview questions:", error);
        }
    };

    // Start the interview
    const handleStartInterview = () => {
        setInterviewStarted(true);
        setTimerActive(true);
    };

    // Handle answer changes
    const handleAnswerChange = (index: number, value: string) => {
        setTransformedQuestions((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, answer: value } : item
            )
        );
    };

    // Navigate between questions
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Check if all questions have been answered
    const areAllQuestionsAnswered = () => {
        return transformedQuestions.every(
            (item) => item.answer.trim().length > 0
        );
    };

    // Modify the handleSubmitInterview function to only send responses
    const handleSubmitInterview = async () => {
        setSubmitting(true);
        setTimerActive(false);

        try {
            // Format responses as an array of strings
            const responses = transformedQuestions.map(
                (item) => item.answer || "No answer provided"
            );

            // Submit interview responses
            await submitResponses(applicationId, responses);

            // Evaluate the responses
            await evaluateInterview(applicationId);

            setInterviewCompleted(true);
            setInterviewSuccess(true);
            pushNotification("Interview completed successfully!", "success");
        } catch (error) {
            console.error("Failed to submit interview:", error);
            pushNotification(
                "There was an error submitting your interview. Please try again.",
                "error"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Handle termination confirmation
    const handleTerminateInterview = async () => {
        setTerminateDialogOpen(false);
        setSubmitting(true);
        setTimerActive(false);

        try {
            const responses = transformedQuestions.map(
                (item) => item.answer || "No answer provided"
            );

            await submitResponses(applicationId, responses);

            // Mark interview as completed
            setInterviewCompleted(true);
            setInterviewSuccess(false);
            pushNotification(
                "Interview terminated. Your responses have been submitted.",
                "warning"
            );
        } catch (error) {
            console.error("Failed to terminate interview:", error);
            pushNotification(
                "There was an error terminating your interview. Please try again.",
                "error"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Handle dialog close
    const handleClose = () => {
        if (!loading && !submitting) {
            // Reset state when closing
            setInterviewStarted(false);
            setInterviewCompleted(false);
            setCurrentQuestionIndex(0);
            setTimeRemaining(interviewTime * 60);
            setTimerActive(false);
            setInterviewSuccess(false);
            setPenaltySeconds(0);
            setLastPenaltyTime(0);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={!loading && !submitting ? handleClose : undefined} // Prevent closing during loading or submitting
            fullWidth
            maxWidth="md"
            disableEscapeKeyDown={
                loading || (interviewStarted && !interviewCompleted)
            } // Prevent escape key during loading or active interview
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: "hidden",
                    maxHeight: "90vh",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 3,
                    pb: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Assignment
                        color="primary"
                        sx={{ mr: 1.5, fontSize: 28 }}
                    />
                    <Box>
                        <Typography variant="h6" component="div">
                            {interviewSuccess
                                ? "Interview Completed"
                                : `Interview for ${postTitle}`}
                        </Typography>
                        {interviewStarted && !interviewCompleted && (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mt: 0.5,
                                }}
                            >
                                <Timer
                                    fontSize="small"
                                    color="action"
                                    sx={{ mr: 0.5 }}
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Time Remaining: {formatTimeRemaining()}
                                    {penaltySeconds > 0 && (
                                        <span
                                            style={{
                                                color: "#f44336",
                                                marginLeft: "4px",
                                            }}
                                        >
                                            (-{Math.floor(penaltySeconds / 60)}:
                                            {(penaltySeconds % 60)
                                                .toString()
                                                .padStart(2, "0")}
                                            )
                                        </span>
                                    )}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
                {!interviewStarted || interviewCompleted ? (
                    <IconButton
                        onClick={handleClose}
                        size="small"
                        aria-label="close"
                    >
                        <Close />
                    </IconButton>
                ) : (
                    <Chip
                        label={`Question ${currentQuestionIndex + 1}/${
                            questions.length
                        }`}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: "medium" }}
                    />
                )}
            </DialogTitle>

            {interviewStarted && !interviewCompleted && (
                <LinearProgress
                    variant="determinate"
                    value={timeProgressPercentage()}
                    sx={{
                        height: 4,
                        bgcolor: (theme) => {
                            const percentage = timeProgressPercentage();
                            return percentage > 75
                                ? `${theme.palette.error.main}30`
                                : percentage > 50
                                ? `${theme.palette.warning.main}30`
                                : `${theme.palette.primary.main}30`;
                        },
                        "& .MuiLinearProgress-bar": {
                            bgcolor: (theme) => {
                                const percentage = timeProgressPercentage();
                                return percentage > 75
                                    ? theme.palette.error.main
                                    : percentage > 50
                                    ? theme.palette.warning.main
                                    : theme.palette.primary.main;
                            },
                        },
                    }}
                />
            )}

            {/* Unfocus warning overlay */}
            {showUnfocusedWarning && (
                <Box
                    sx={{
                        position: "absolute",
                        zIndex: 10,
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.85)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                    }}
                >
                    <VisibilityOff
                        sx={{ fontSize: 60, mb: 2, color: "#f44336" }}
                    />
                    <Typography variant="h5" gutterBottom align="center">
                        Return to the Interview
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                        Leaving this window reduces your time limit!
                    </Typography>
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ maxWidth: "80%" }}
                    >
                        Each time you leave the interview,{" "}
                        {Math.floor(UNFOCUS_PENALTY_SECONDS / 60)} minutes will
                        be deducted from your time.
                    </Typography>
                </Box>
            )}

            <DialogContent
                sx={{
                    p: interviewStarted ? 0 : 3,
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: (theme) =>
                            `${theme.palette.primary.main}40`,
                        borderRadius: "4px",
                    },
                }}
            >
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 8,
                        }}
                    >
                        <CircularProgress size={48} sx={{ mb: 2 }} />
                        <Typography variant="body1" align="center">
                            {interviewStarted ? (
                                "Processing your interview..."
                            ) : (
                                <>
                                    Preparing your interview questions...
                                    <br />
                                    <span
                                        style={{
                                            fontSize: "0.8em",
                                            color: "#888",
                                        }}
                                    >
                                        Please wait.
                                    </span>
                                </>
                            )}
                        </Typography>
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                ) : interviewSuccess ? (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                        <CheckCircleOutline
                            color="success"
                            sx={{ fontSize: 80, mb: 2 }}
                        />
                        <Typography variant="h5" gutterBottom>
                            Interview Submitted Successfully!
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Thank you for completing the interview. Your
                            responses have been recorded and will be evaluated.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            You can check your interview scores in the dashboard
                            once the evaluation is complete.
                        </Typography>
                    </Box>
                ) : !interviewStarted ? (
                    // Instructions before starting
                    <Box sx={{ py: 2 }}>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="body1" fontWeight="medium">
                                Important Instructions
                            </Typography>
                            <Typography variant="body2">
                                You will have {interviewTime} minutes to
                                complete this interview. Please ensure you have
                                a quiet environment and enough time to finish.
                            </Typography>
                        </Alert>

                        <Typography variant="h6" gutterBottom>
                            Interview Overview
                        </Typography>
                        <Typography variant="body1" paragraph>
                            This interview consists of {questions.length}{" "}
                            questions related to the position:{" "}
                            <strong>{postTitle}</strong>. Answer each question
                            to the best of your ability.
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Before you begin:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography variant="body2">
                                        You cannot pause the timer once you
                                        start.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        You can navigate between questions using
                                        the Previous and Next buttons.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        All questions must be answered before
                                        submitting.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        Your responses will be evaluated after
                                        submission.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        Answers must be written in English.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        Copy, paste, and cut actions are
                                        disabled in the answer input field.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "error.main",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Switching to other tabs or windows
                                        during the interview will reduce your
                                        time limit by{" "}
                                        {Math.floor(
                                            UNFOCUS_PENALTY_SECONDS / 60
                                        )}{" "}
                                        minutes each time.
                                    </Typography>
                                </li>
                            </ul>
                        </Box>

                        <Typography variant="body1" fontWeight="medium">
                            When you're ready, click "Start Interview" to begin.
                            Good luck!
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ height: "100%" }}>
                        {transformedQuestions.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display:
                                        index === currentQuestionIndex
                                            ? "block"
                                            : "none",
                                    p: 3,
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        mb: 3,
                                        borderRadius: 2,
                                        bgcolor: (theme) =>
                                            `${theme.palette.primary.main}08`,
                                        border: 1,
                                        borderColor: "divider",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            mb: 1,
                                        }}
                                    >
                                        <HelpOutline
                                            color="primary"
                                            sx={{ mr: 1.5, mt: 0.3 }}
                                        />
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{ lineHeight: 1.4 }}
                                            onCopy={(e) => e.preventDefault()}
                                            onCut={(e) => e.preventDefault()}
                                        >
                                            {item.question}
                                        </Typography>
                                    </Box>
                                </Paper>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={5}
                                    placeholder="Type your answer here in English..."
                                    variant="outlined"
                                    value={item.answer}
                                    onChange={(e) =>
                                        handleAnswerChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    disabled={submitting || interviewCompleted} // Disable if submitting or completed
                                    sx={{ mb: 3 }}
                                    onCopy={(e) => e.preventDefault()} // Disable copy
                                    onPaste={(e) => e.preventDefault()} // Disable paste
                                    onCut={(e) => e.preventDefault()} // Disable cut
                                    onDrop={(e) => e.preventDefault()} // Disable drop
                                />

                                <Grid
                                    container
                                    spacing={2}
                                    sx={{
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    {/* First group - Previous button and question counter */}
                                    <Grid
                                        item
                                        xs={6}
                                        sm="auto"
                                        sx={{
                                            display: "flex",
                                            flexDirection: {
                                                xs: "column",
                                                sm: "row",
                                            },
                                            alignItems: {
                                                xs: "stretch",
                                                sm: "center",
                                            },
                                            gap: { xs: 1, sm: 2 },
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            onClick={handlePreviousQuestion}
                                            disabled={
                                                currentQuestionIndex === 0 ||
                                                submitting
                                            }
                                            sx={{
                                                minWidth: {
                                                    xs: "100%",
                                                    sm: "80px",
                                                },
                                            }}
                                        >
                                            Previous
                                        </Button>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            align="center"
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                py: { xs: 0.5, sm: 0 },
                                            }}
                                        >
                                            {currentQuestionIndex + 1} of{" "}
                                            {transformedQuestions.length}
                                        </Typography>
                                    </Grid>

                                    {/* Second group - Next/Submit button and Terminate button */}
                                    <Grid
                                        item
                                        xs={6}
                                        sm="auto"
                                        sx={{
                                            display: "flex",
                                            flexDirection: {
                                                xs: "column",
                                                sm: "row",
                                            },
                                            alignItems: {
                                                xs: "stretch",
                                                sm: "center",
                                            },
                                            gap: { xs: 1, sm: 2 },
                                        }}
                                    >
                                        {currentQuestionIndex ===
                                        transformedQuestions.length - 1 ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSubmitInterview}
                                                disabled={
                                                    interviewCompleted ||
                                                    !areAllQuestionsAnswered() ||
                                                    submitting
                                                }
                                                sx={{
                                                    minWidth: {
                                                        xs: "100%",
                                                        sm: "130px",
                                                    },
                                                }}
                                            >
                                                Submit Interview
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                onClick={handleNextQuestion}
                                                disabled={submitting}
                                                sx={{
                                                    minWidth: {
                                                        xs: "100%",
                                                        sm: "80px",
                                                    },
                                                }}
                                            >
                                                Next
                                            </Button>
                                        )}
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() =>
                                                setTerminateDialogOpen(true)
                                            }
                                            disabled={submitting}
                                            size="small"
                                            sx={{
                                                minWidth: {
                                                    xs: "100%",
                                                    sm: "90px",
                                                },
                                                fontSize: "0.75rem",
                                                py: 0.75,
                                            }}
                                        >
                                            Terminate
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Box>
                )}
            </DialogContent>

            {!interviewStarted && !interviewSuccess && questions.length > 0 && (
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStartInterview}
                        disabled={loading}
                        startIcon={<Timer />}
                    >
                        Start Interview
                    </Button>
                </DialogActions>
            )}

            {interviewSuccess && (
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClose}
                    >
                        Back to Dashboard
                    </Button>
                </DialogActions>
            )}

            {/* Termination confirmation dialog */}
            <ConfirmationDialog
                open={terminateDialogOpen}
                onClose={() => setTerminateDialogOpen(false)}
            >
                <DialogTitle>Terminate Interview</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to terminate the interview? All
                        your current answers will be submitted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setTerminateDialogOpen(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleTerminateInterview}
                        color="error"
                        variant="contained"
                        disabled={submitting}
                    >
                        Terminate
                    </Button>
                </DialogActions>
            </ConfirmationDialog>
        </Dialog>
    );
};

export default InterviewDialog;
