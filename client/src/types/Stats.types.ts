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

interface EmployerPost {
    id: number;
    title: string;
    salary: string;
    uploaded_at: string;
    final_date: string;
}

interface InterviewTest {
    question: string[] | null;
    answer: string[] | null;
    score: number | null;
}

export interface EmployerDashboardApplication {
    id: number;
    post_title: string;
    applicant_email: string;
    cv_id: number;
    post_id: number;
    interview_id: number | null;
    application_date: string;
    status: string;
    test: InterviewTest;
}

export interface EmployerDashboardStats {
    my_posts: EmployerPost[];
    total_posts: number;
    applications: EmployerDashboardApplication[];
    total_applications: number;
    pending_applications: number;
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
    question: string[] | null;
    answer: string[] | null;
    score: number | null;
    final_date: string;
}
interface Application {
    application_id: number;
    post_title: string;
    cv_id: number;
    interview_id: number | null;
    status: string;
    application_date: string;
}
