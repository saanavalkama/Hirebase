export interface RegisterRequest{
    email:string,
    password: string,
    role: UserRole
}

export interface AuthResponse{
    accessToken:string
}

export interface MeResponse {
    userId: string,
    email: string,
    role: UserRole,
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
    gitHub: GitHub
}

export interface GitHub{
    hasConnected: boolean
    fetchStatus: FetchStatus
    nextRefreshAvailable: string
    signals: Signals
}

export interface Signals{
    activityScore: number
    calculatedAt: string
    externalPrCount: number
    popularityScore: number
    repoMaturityScore: number
    topLanguages:string[]
}

export type FetchStatus = 
    | "Pending" 
    | "Processing" 
   | "Done"
    | "Failed"




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
    softSkills?: SoftSkillType[],
    preferredRoles?: PreferredRoleType[],
    seniorityLevel?: SeniorityLevel,
    remotePreference?: RemotePreference,
}

export interface RecruiterProfileResponse{
    id: string,
    UserId:string,
    name:string,
    createdAt:string, 
    updatedAt:string,
    organizations:OrganizationResponse[]
}

export interface OrganizationResponse{
    id: string,
    name:string,
    websiteUrl?:string,
    location?:string,
    createdAt:string,
    updatedAt:string
}

export interface CreateRecruiterProfileRequest{
    name:string
}

export interface UpdateRecruiterProfileRequest{
    name?:string
}

export interface CreateOrganizationRequest{
    name:string,
    websiteUrl?:string,
    location?:string,
}

export interface UpdateOrganizationRequest{
    name?:string,
    websiteUrl?:string,
    location?:string,
    id:string
}

export interface JobPostingResponse{
    id:string,
    organizationId:string,
    organizationName:string,
    title:string,
    description:string,
    seniorityLevel?: SeniorityLevel,
    salaryMin?:number,
    salaryMax?:number,
    location?:string,
    remotePrefrence?: RemotePreference,
    status:JobPostingStatus,
    lastApplicationDay?:string,
    createdAt:string,
    updatedAt:string
    requiredLanguages:string[],
    preferredRole:string,
    jobPostingSoftSkills:string[]
}


export type JobPostingStatus =
  | "Draft"
  | "Open"
  | "Closed"

export interface CreateJobPostingRequest{
    organizationId:string,
    title:string,
    description:string,
    seniorityLevel?: SeniorityLevel,
    salaryMin?:number,
    salaryMax?:number,
    location?:string,
    remotePreference?: RemotePreference,
    status: "Draft" | "Open" | "Closed",
    lastApplicationDay?:string,
    requiredLanguages?: string[],
    preferredRole?: string,
    jobPostingSoftSkills?: string[],
}

export interface UpdateJobPostingRequest{
    id:string,
    title?:string,
    description?:string,
    seniorityLevel?: SeniorityLevel,
    salaryMin?:number,
    salaryMax?:number,
    location?:string,
    remotePreference?: RemotePreference,
    status: "Draft" | "Open" | "Closed",
    lastApplicationDay?:string,
    requiredLanguages?: string[],
    preferredRole?: string,
    jobPostingSoftSkills?: string[],
}
