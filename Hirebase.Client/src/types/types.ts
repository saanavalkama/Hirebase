export interface RegisterRequest{
    email:string,
    password: string,
    role: UserRole
}

export interface AuthResponse{
    accessToken:string
}

export interface LoginRequest{
    email: string,
    password:string
}

export type UserRole = "CANDIDATE" | "RECRUITER"