import { createContext, useContext, useState, ReactNode } from "react";
import { cvInterviewApi } from "../services/api";
import { useNotification } from "../components/notifications/SlideInNotifications";

interface InterviewQuestion {
    id?: number;
    question: string;
    answer?: string;
}

interface CVInterviewContextType {
    questions: InterviewQuestion[];
    cvMatchScore?: number;
    loading: boolean;
    error: string | null;
    uploadCV: (title: string, file: File) => Promise<number>;
    compareWithJob: (cvId: number, postId: number) => Promise<void>;
    generateQuestions: (postId: number) => Promise<void>;
    submitResponses: (
        postId: number,
        responses: InterviewQuestion[]
    ) => Promise<void>;
    evaluateInterview: (postId: number, answers: string[]) => Promise<void>;
}

const CVInterviewContext = createContext<CVInterviewContextType | undefined>(
    undefined
);

export const CVInterviewProvider = ({ children }: { children: ReactNode }) => {
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [cvMatchScore, setCvMatchScore] = useState<number | undefined>();
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
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const compareWithJob = async (cvId: number, postId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cvInterviewApi.compareCvWithPost(
                cvId,
                postId
            );
            setCvMatchScore(response.data.match_score);
            pushNotification("CV comparison completed!", "success");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to compare CV with job";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const generateQuestions = async (postId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cvInterviewApi.generateInterviewQuestions(
                postId
            );
            setQuestions(response.data.questions);
            pushNotification("Interview questions generated!", "success");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to generate questions";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const submitResponses = async (
        postId: number,
        responses: InterviewQuestion[]
    ) => {
        try {
            setLoading(true);
            setError(null);
            await cvInterviewApi.submitInterviewResponses(
                postId,
                responses.map(({ question, answer }) => ({
                    question,
                    answer: answer || "",
                }))
            );
            pushNotification("Interview responses submitted!", "success");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to submit responses";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const evaluateInterview = async (postId: number, answers: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cvInterviewApi.evaluateResponses(
                postId,
                answers
            );
            pushNotification("Interview evaluated successfully!", "success");
            return response.data;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || "Failed to evaluate interview";
            setError(errorMessage);
            pushNotification(errorMessage, "error");
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
                uploadCV,
                compareWithJob,
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
