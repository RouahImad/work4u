// filepath: client/src/types/job.types.ts

export interface JobPost {
    id: number;
    title: string;
    description: string;
    final_date: string;
    salaire: number;
    uploaded_at?: string;
    user_id?: number;
    accepted?: boolean;
}
export interface Job extends JobPost {
    company_name: string;
    company_address: string;
    company_website: string;
}
