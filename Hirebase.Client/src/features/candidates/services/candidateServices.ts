import { api } from "@/lib/api";
import type { CandidateProfileResponse, UpdateCandidateProfileRequest } from "@/types/types";

export const candidateService = {

    getProfile: async():Promise<CandidateProfileResponse> => {
        const response = await api.get<CandidateProfileResponse>("/api/candidate/profile")
        return response.data

    },

    updateProfile: async(data: UpdateCandidateProfileRequest):Promise<CandidateProfileResponse> => {
        const response = await api.patch("/api/candidate/profile",data)
        return response.data
    },

    connectGitHub: async () => {
        const response = await api.get("/api/github/connect")
        window.location.href = response.data.url
    }
}