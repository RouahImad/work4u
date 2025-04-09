import { createContext, useContext, useState, ReactNode } from "react";
import { cvInterviewApi } from "../services/api";
import { useNotification } from "../components/notifications/SlideInNotifications";
import { logError } from "../services/errorUtils";

interface CVInterviewContextType {
    questions: string[];
    cvMatchScore?: number;
    loading: boolean;
    error: string | null;
    applicationId?: number;
    interviewId?: number;
    uploadCV: (title: string, file: File) => Promise<number>;
    compareWithJob: (
        cvId: number,
        postId: number
    ) => Promise<number | undefined>;
    saveInterview: (applicationId: number) => Promise<number | undefined>;
    generateQuestions: (applicationId: number) => Promise<void>;
    submitResponses: (
        applicationId: number,
        responses: string[]
    ) => Promise<void>;
    evaluateInterview: (applicationId: number) => Promise<any>;
}

const CVInterviewContext = createContext<CVInterviewContextType | undefined>(
    undefined
);

export const CVInterviewProvider = ({ children }: { children: ReactNode }) => {
    const [questions, setQuestions] = useState<string[]>([]);
    const [cvMatchScore, setCvMatchScore] = useState<number | undefined>();
    const [applicationId, setApplicationId] = useState<number | undefined>();
    const [interviewId, setInterviewId] = useState<number | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { pushNotification } = useNotification();

    const uploadCV = async (title: string, file: File): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            const response = await cvInterviewApi.uploadCV(title, file);
            pushNotification("CV uploaded successfully!", "success");
            // Return the CV ID for further operations
            return response.data.id;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to upload CV";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            logError(err, "uploadCV");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const compareWithJob = async (
        cvId: number,
        postId: number
    ): Promise<number | undefined> => {
        try {
            setLoading(true);
            setError(null);
            const response = await cvInterviewApi.compareCvWithPost(
                cvId,
                postId
            );

            // Check if similarity score is above threshold (0.5 or 50%)
            if (response.data.similarity_score > 50) {
                setCvMatchScore(response.data.similarity_score);
                setApplicationId(response.data.application_id);
                pushNotification(
                    `Your CV matched the job with a score of ${response.data.similarity_score.toFixed(
                        1
                    )}%!`,
                    "success"
                );
                return response.data.application_id;
            } else {
                setCvMatchScore(response.data.similarity_score);
                pushNotification(
                    `Your CV didn't match the job requirements (${response.data.similarity_score.toFixed(
                        1
                    )}%).`,
                    "error"
                );
                pushNotification(
                    "Try applying to jobs that better match your experience.",
                    "error"
                );
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail ||
                err.message ||
                "Failed to compare CV with job";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            logError(err, "compareWithJob");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const saveInterview = async (
        applicationId: number
    ): Promise<number | undefined> => {
        try {
            setLoading(true);
            setError(null);
            const response = await cvInterviewApi.saveInterview(applicationId);
            setInterviewId(response.data.interview_id);
            pushNotification("Interview saved! Ready to start.", "success");

            return response.data.interview_id;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error || "Failed to save interview";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            logError(err, "saveInterview");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const generateQuestions = async (applicationId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cvInterviewApi.generateInterviewQuestions(
                applicationId
            );
            setQuestions(response.data.questions);
            setInterviewId(response.data.interview_id);
            pushNotification("Interview questions generated!", "success");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error || "Failed to generate questions";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            logError(err, "generateQuestions");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const submitResponses = async (
        applicationId: number,
        responses: string[]
    ) => {
        try {
            setLoading(true);
            setError(null);
            await cvInterviewApi.submitInterviewResponses(
                applicationId,
                responses
            );
            pushNotification("Interview responses submitted!", "success");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error || "Failed to submit responses";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            logError(err, "submitResponses");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const evaluateInterview = async (applicationId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cvInterviewApi.evaluateResponses(
                applicationId
            );
            pushNotification("Interview evaluated successfully!", "success");
            return response.data;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error || "Failed to evaluate interview";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            logError(err, "evaluateInterview");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CVInterviewContext.Provider
            value={{
                questions,
                cvMatchScore,
                loading,
                error,
                applicationId,
                interviewId,
                uploadCV,
                compareWithJob,
                saveInterview,
                generateQuestions,
                submitResponses,
                evaluateInterview,
            }}
        >
            {children}
        </CVInterviewContext.Provider>
    );
};

export const useCVInterview = () => {
    const context = useContext(CVInterviewContext);
    if (context === undefined) {
        throw new Error(
            "useCVInterview must be used within a CVInterviewProvider"
        );
    }
    return context;
};
