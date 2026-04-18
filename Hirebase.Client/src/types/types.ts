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

export type SeniorityLevel = "Junior" | "Mid" | "Senior" | "Lead"

export type RemotePreference = "Remote" | "Hybrid" | "Onsite"

export type SoftSkillType =
    | "Communication"
    | "Teamwork"
    | "Leadership"
    | "ProblemSolving"
    | "Adaptability"
    | "TimeManagement"
    | "Mentoring"
    | "Collaboration"
    | "Ownership"
    | "Creativity"

export type PreferredRoleType =
    | "FrontendEngineer"
    | "BackendEngineer"
    | "FullstackEngineer"
    | "MobileEngineer"
    | "DevOps"
    | "DataEngineer"
    | "MachineLearningEngineer"
    | "QAEngineer"
    | "SecurityEngineer"
    | "EmbeddedEngineer"
    | "AIEngineer"

export interface CandidateProfileResponse {
    id: string,
    userId: string,
    name?: string,
    location?: string,
    bio?: string,
    linkedInUrl?: string,
    personalSiteUrl?: string,
    cvUrl?: string,
    yearsOfExperience?: number,
    salaryMin?: number,
    salaryMax?: number,
    availableFrom?: string,
    softSkills: SoftSkillType[],
    preferredRoles: PreferredRoleType[],
    seniorityLevel?: SeniorityLevel,
    remotePreference?: RemotePreference,
    createdAt: string,
    updatedAt: string,
}

export interface UpdateCandidateProfileRequest {
    name?: string,
    location?: string,
    bio?: string,
    linkedInUrl?: string,
    personalSiteUrl?: string,
    cvUrl?: string,
    yearsOfExperience?: number,
    salaryMin?: number,
    salaryMax?: number,
    availableFrom?: string,
    softSkills: SoftSkillType[],
    preferredRoles: PreferredRoleType[],
    seniorityLevel?: SeniorityLevel,
    remotePreference?: RemotePreference,
}

