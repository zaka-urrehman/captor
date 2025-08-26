// Authentication related TypeScript interfaces

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// Backend API Response Structure
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
    errors: Record<string, string[]> | null;
    meta: any | null;
}

// Login Response Data
export interface LoginData {
    access_token: string;
    token_type: string;
}

// User data (for future use)
export interface User {
    id: string;
    name: string;
    email: string;
}

// Type aliases for specific responses
export type LoginResponse = ApiResponse<LoginData>;
export type SignupResponse = ApiResponse<User>;

export interface ApiError {
    message: string;
    status?: number;
    errors?: Record<string, string[]>;
}
