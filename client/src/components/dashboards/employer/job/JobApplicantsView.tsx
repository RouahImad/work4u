import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Divider,
    Chip,
    Avatar,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme,
    useMediaQuery,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Stack,
} from "@mui/material";
import {
    ExpandMore,
    School,
    QuestionAnswer,
    Close,
    Schedule,
    HourglassEmpty,
} from "@mui/icons-material";
import { EmployerDashboardApplication } from "../../../../types/Stats.types";
import { formatDate } from "../../../../services/utils";

interface JobApplicantsViewProps {
    applications: EmployerDashboardApplication[];
    jobTitle: string;
    loading: boolean;
    error: string | null;
    open: boolean;
    onClose: () => void;
}

const JobApplicantsView: React.FC<JobApplicantsViewProps> = ({
    applications,
    jobTitle,
    loading,
    error,
    open,
    onClose,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [selectedApplicant, setSelectedApplicant] =
        useState<EmployerDashboardApplication | null>(null);
    const [interviewDetailsOpen, setInterviewDetailsOpen] = useState(false);

    // Filter applications based on post_id (this would be done by the parent component in practice)
    // This component receives already filtered applications

    const handleViewInterviewDetails = (
        applicant: EmployerDashboardApplication
    ) => {
        setSelectedApplicant(applicant);
        setInterviewDetailsOpen(true);
    };

    const handleCloseInterviewDetails = () => {
        setInterviewDetailsOpen(false);
    };

    if (!open) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            fullScreen={isMobile}
        >
            <DialogTitle
                sx={{
                    pb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6" component="div">
                    Applicants for {jobTitle}
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 4,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : applications.length === 0 ? (
                    <Alert severity="info">
                        No applicants found for this job posting.
                    </Alert>
                ) : (
                    <Box sx={{ py: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                        >
                            {applications.length}{" "}
                            {applications.length === 1
                                ? "candidate"
                                : "candidates"}{" "}
                            have applied to this position
                        </Typography>

                        <Grid container spacing={2}>
                            {applications.map((applicant) => (
                                <Grid item xs={12} key={applicant.id}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            mb: 2,

                                            transition: "all 0.2s",
                                            "&:hover": {
                                                boxShadow:
                                                    "0 4px 10px rgba(0,0,0,0.08)",
                                            },
                                        }}
                                    >
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: {
                                                        xs: "column",
                                                        sm: "row",
                                                    },
                                                    justifyContent:
                                                        "space-between",
                                                    mb: 2,
                                                    gap: 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            bgcolor:
                                                                applicant.status ===
                                                                "accepte"
                                                                    ? "success.light"
                                                                    : applicant.status ===
                                                                      "refuse"
                                                                    ? "error.light"
                                                                    : "warning.light",
                                                            width: 50,
                                                            height: 50,
                                                        }}
                                                    >
                                                        {applicant.applicant_email
                                                            .substring(0, 1)
                                                            .toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6">
                                                            {
                                                                applicant.applicant_email
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Applied on{" "}
                                                            {formatDate(
                                                                applicant.application_date,
                                                                true
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        gap: 1,
                                                        alignItems: "center",
                                                        flexWrap: "wrap",
                                                        justifyContent: {
                                                            xs: "flex-start",
                                                            sm: "flex-end",
                                                        },
                                                    }}
                                                >
                                                    <Chip
                                                        label={
                                                            applicant.status ===
                                                            "accepte"
                                                                ? "Accepted"
                                                                : applicant.status ===
                                                                  "refuse"
                                                                ? "Rejected"
                                                                : "Pending"
                                                        }
                                                        color={
                                                            applicant.status ===
                                                            "accepte"
                                                                ? "success"
                                                                : applicant.status ===
                                                                  "refuse"
                                                                ? "error"
                                                                : "warning"
                                                        }
                                                        sx={{
                                                            fontWeight:
                                                                "medium",
                                                            color: "#fff",
                                                        }}
                                                    />

                                                    {applicant.test &&
                                                        applicant.test.score !==
                                                            null && (
                                                            <Chip
                                                                icon={
                                                                    <School fontSize="small" />
                                                                }
                                                                label={`Score: ${applicant.test.score}%`}
                                                                color="primary"
                                                            />
                                                        )}

                                                    {applicant.interview_id &&
                                                        (!applicant.test ||
                                                            applicant.test
                                                                .score ===
                                                                null) && (
                                                            <Chip
                                                                icon={
                                                                    <Schedule fontSize="small" />
                                                                }
                                                                label="Interview scheduled"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        )}

                                                    {!applicant.interview_id && (
                                                        <Chip
                                                            icon={
                                                                <HourglassEmpty fontSize="small" />
                                                            }
                                                            label="Awaiting interview"
                                                            color="default"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            </Box>

                                            {applicant.test &&
                                                applicant.test.score !== null &&
                                                applicant.test.question &&
                                                applicant.test.question.length >
                                                    0 && (
                                                    <Box sx={{ mt: 2 }}>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={
                                                                <QuestionAnswer />
                                                            }
                                                            onClick={() =>
                                                                handleViewInterviewDetails(
                                                                    applicant
                                                                )
                                                            }
                                                            size="small"
                                                        >
                                                            View Interview
                                                            Details (
                                                            {
                                                                applicant.test
                                                                    .question
                                                                    .length
                                                            }{" "}
                                                            questions)
                                                        </Button>
                                                    </Box>
                                                )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Interview Details Dialog */}
                <Dialog
                    open={interviewDetailsOpen}
                    onClose={handleCloseInterviewDetails}
                    fullWidth
                    maxWidth="md"
                    fullScreen={isMobile}
                >
                    <DialogTitle
                        sx={{
                            pb: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h6">
                            Interview Response Details
                        </Typography>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleCloseInterviewDetails}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        {selectedApplicant &&
                            selectedApplicant.test &&
                            selectedApplicant.test.question &&
                            selectedApplicant.test.answer && (
                                <Box sx={{ py: 2 }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                        >
                                            Candidate:{" "}
                                            {selectedApplicant.applicant_email}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            Applied for:{" "}
                                            {selectedApplicant.post_title}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mt: 2,
                                            }}
                                        >
                                            <Typography variant="subtitle2">
                                                Overall Score:
                                            </Typography>
                                            <Chip
                                                label={`${selectedApplicant.test.score}%`}
                                                color={
                                                    selectedApplicant.test
                                                        .score &&
                                                    selectedApplicant.test
                                                        .score >= 70
                                                        ? "success"
                                                        : "warning"
                                                }
                                                sx={{
                                                    color: "#fff",
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography
                                        variant="h6"
                                        color="primary"
                                        gutterBottom
                                    >
                                        Interview Questions & Answers
                                    </Typography>

                                    {selectedApplicant.test.question.map(
                                        (question, index) => (
                                            <Accordion
                                                key={index}
                                                defaultExpanded={index === 0}
                                                sx={{
                                                    mb: 2,
                                                    boxShadow:
                                                        "0 2px 8px rgba(0,0,0,0.05)",
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={<ExpandMore />}
                                                    sx={{
                                                        bgcolor:
                                                            "background.default",
                                                    }}
                                                >
                                                    <Typography variant="subtitle1">
                                                        Question {index + 1}
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Stack spacing={2}>
                                                        <Box>
                                                            <Typography
                                                                variant="subtitle2"
                                                                color="primary"
                                                                gutterBottom
                                                            >
                                                                Question:
                                                            </Typography>
                                                            <Paper
                                                                variant="outlined"
                                                                sx={{
                                                                    p: 2,
                                                                    bgcolor:
                                                                        "background.default",
                                                                }}
                                                            >
                                                                <Typography variant="body1">
                                                                    {question ||
                                                                        "No question recorded"}
                                                                </Typography>
                                                            </Paper>
                                                        </Box>

                                                        <Box>
                                                            <Typography
                                                                variant="subtitle2"
                                                                color="primary"
                                                                gutterBottom
                                                            >
                                                                Answer:
                                                            </Typography>
                                                            <Paper
                                                                variant="outlined"
                                                                sx={{
                                                                    p: 2,
                                                                    bgcolor:
                                                                        "background.default",
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body1"
                                                                    sx={{
                                                                        whiteSpace:
                                                                            "pre-wrap",
                                                                    }}
                                                                >
                                                                    {selectedApplicant
                                                                        ?.test
                                                                        ?.answer &&
                                                                    selectedApplicant
                                                                        ?.test
                                                                        ?.answer[
                                                                        index
                                                                    ]
                                                                        ? selectedApplicant
                                                                              .test
                                                                              .answer[
                                                                              index
                                                                          ]
                                                                        : "No answer recorded"}
                                                                </Typography>
                                                            </Paper>
                                                        </Box>
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion>
                                        )
                                    )}
                                </Box>
                            )}
                    </DialogContent>
                </Dialog>
            </DialogContent>
        </Dialog>
    );
};

export default JobApplicantsView;
