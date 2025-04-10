import { UserBase } from "./User.types";

// Admin Dashboard Stats
export interface AdminDashboardStats {
    users: {
        total: number;
        list: UserBase[];
    };
    posts: {
        total: number;
        average_salaire: number;
    };
    cvs: {
        total: number;
    };
    interview_responses: {
        total: number;
        average_score: number;
    };
    applications: {
        total: number;
        pending: number;
        accepted: number;
    };
    reports: {
        total: number;
        details: ReportDetail[];
    };
}
interface ReportDetail {
    id: number;
    post_title: string;
    user_email: string;
    description: string;
    reported_at: string;
}

// Employer Dashboard Stats
export interface EmployerDashboardStats {
    my_posts: EmployerPost[];
    total_posts: number;
    applications: EmployerApplication[];
    total_applications: number;
    pending_applications: number;
}

interface EmployerPost {
    id: number;
    title: string;
    salaire: string;
    uploaded_at: string;
    final_date?: string;
}

interface InterviewTest {
    question: string;
    answer: string;
    score: number;
}

interface EmployerApplication {
    id: number;
    post_title: string;
    applicant_email: string;
    cv_id: number;
    interview_id: number | null;
    application_date: string;
    status: string; // "accepte" | "en_attente" would be better
    test: InterviewTest | null;
}

// Employee Dashboard Stats
export interface EmployeeDashboardStats {
    interview_history: InterviewHistory[];
    total_responses: number;
    average_score: number;
    applications: Application[];
}
interface InterviewHistory {
    id: number;
    post_title: string;
    question: string;
    answer: string;
    score: number;
    response_date: string;
}
interface Application {
    application_id: number;
    post_title: string;
    cv_id: number;
    interview_id: number | null;
    status: string;
    application_date: string;
    company_name?: string; // This would be useful to display
}
