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
} from "@mui/material";
import {
    Close,
    Timer,
    CheckCircleOutline,
    Assignment,
    HelpOutline,
} from "@mui/icons-material";
import { useCVInterview } from "../../contexts/CVInterviewContext";
import { useNotification } from "../notifications/SlideInNotifications";

interface InterviewDialogProps {
    open: boolean;
    onClose: () => void;
    postId: number;
    postTitle: string;
    interviewTime?: number; // Time in minutes for the interview
}

const InterviewDialog: React.FC<InterviewDialogProps> = ({
    open,
    onClose,
    postId,
    postTitle,
    interviewTime = 30, // Default interview time: 30 minutes
}) => {
    const { questions, loading, error, generateQuestions, submitResponses } =
        useCVInterview();
    const { pushNotification } = useNotification();

    // Interview state
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [interviewCompleted, setInterviewCompleted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [interviewSuccess, setInterviewSuccess] = useState(false);

    // Timer state
    const [timeRemaining, setTimeRemaining] = useState(interviewTime * 60); // Convert minutes to seconds
    const [timerActive, setTimerActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Load questions when dialog opens
    useEffect(() => {
        if (open && !interviewStarted && !interviewCompleted) {
            loadQuestions();
        }
    }, [open]);

    // Initialize answers object when questions change
    useEffect(() => {
        if (questions.length > 0) {
            const initialAnswers: { [key: string]: string } = {};
            questions.forEach((question) => {
                initialAnswers[question.question] = "";
            });
            setAnswers(initialAnswers);
        }
    }, [questions]);

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
            await generateQuestions(postId);
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
    const handleAnswerChange = (question: string, value: string) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [question]: value,
        }));
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
        return questions.every(
            (question) => answers[question.question]?.trim().length > 0
        );
    };

    // Submit the interview
    const handleSubmitInterview = async () => {
        setSubmitting(true);
        setTimerActive(false);

        try {
            // Format responses for API
            const responses = questions.map((question) => ({
                question: question.question,
                answer: answers[question.question] || "No answer provided",
            }));

            await submitResponses(postId, responses);
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
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            disableEscapeKeyDown={interviewStarted && !interviewCompleted}
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
                            {interviewStarted
                                ? "Processing your interview..."
                                : "Preparing your interview questions..."}
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
                                        start
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        You can navigate between questions using
                                        the Previous and Next buttons
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        All questions must be answered before
                                        submitting
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        Your responses will be evaluated after
                                        submission
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
                    // Interview questions
                    <Box sx={{ height: "100%" }}>
                        {questions.map((question, index) => (
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
                                        >
                                            {question.question}
                                        </Typography>
                                    </Box>
                                </Paper>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={8}
                                    placeholder="Type your answer here..."
                                    variant="outlined"
                                    value={answers[question.question] || ""}
                                    onChange={(e) =>
                                        handleAnswerChange(
                                            question.question,
                                            e.target.value
                                        )
                                    }
                                    disabled={submitting}
                                    sx={{ mb: 3 }}
                                />

                                <Grid
                                    container
                                    spacing={2}
                                    sx={{
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            onClick={handlePreviousQuestion}
                                            disabled={
                                                currentQuestionIndex === 0 ||
                                                submitting
                                            }
                                        >
                                            Previous
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {currentQuestionIndex + 1} of{" "}
                                            {questions.length}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        {currentQuestionIndex ===
                                        questions.length - 1 ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSubmitInterview}
                                                disabled={
                                                    !areAllQuestionsAnswered() ||
                                                    submitting
                                                }
                                            >
                                                Submit Interview
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                onClick={handleNextQuestion}
                                                disabled={submitting}
                                            >
                                                Next
                                            </Button>
                                        )}
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
        </Dialog>
    );
};

export default InterviewDialog;
