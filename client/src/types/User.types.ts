// User entity
export interface UserBase {
    id: number;
    username: string;
    email: string;
    role: string;
    verified: boolean;
}

export interface User extends UserBase {
    first_name: string;
    last_name: string;
    company_name?: string;
    company_address?: string;
    company_website?: string;
    created_at?: string;
    updated_at?: string;
}

// User management props
export interface UsersManagementProps {
    users: UserBase[];
}

// Dialog props
export interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
}

// Registration interfaces
export interface BaseRegistrationData {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
}

export interface EmployeeRegistrationData extends BaseRegistrationData {
    role: "employee";
}

export interface EmployerRegistrationData extends BaseRegistrationData {
    role: "employer";
    company_name: string;
    company_address: string;
    company_website: string;
}

export interface CreateUserData {
    email: string;
    password: string;
    username: string;
    role: string;
    first_name: string;
    last_name: string;
    company_name?: string;
    company_address?: string;
    company_website?: string;
}
