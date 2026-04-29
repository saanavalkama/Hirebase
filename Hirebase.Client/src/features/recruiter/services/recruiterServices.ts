import { api } from "@/lib/api";
import type { CreateRecruiterProfileRequest, RecruiterProfileResponse, UpdateRecruiterProfileRequest } from "@/types/types";

export const recuiterServices = {
    
    createRecruiterProfile: async (data:CreateRecruiterProfileRequest):Promise<RecruiterProfileResponse> => {
        const response = await api.post<RecruiterProfileResponse>("/api/recruiter/profile",data)
        return response.data
    },

    updateRecruiterProfile: async(data:UpdateRecruiterProfileRequest):Promise<RecruiterProfileResponse> => {
        const response = await api.patch<RecruiterProfileResponse>("/api/recruiter/profile", data)
        return response.data
        
    },

    getOwnProfile: async():Promise<RecruiterProfileResponse> => {
        const response = await api.get<RecruiterProfileResponse>("/api/recruiter/profile")
        return response.data
    },

    deleteOwnRecruiterProfile: async() => {
        await api.delete("/api/recruiter/profile")
    }
}