import { api } from "@/lib/api"
import type { ApplyRequest, ApplyResponse } from "@/types/types"

const BASE_URL = `/api/application`

export const applicationServices = {

    apply: async(data:ApplyRequest):Promise<ApplyResponse> => {
        const response = await api.post<ApplyResponse>(`${BASE_URL}/${data.jobPostingId}`)
        return response.data
    },

    getAllJobIds: async():Promise<string[]> => {
        const response = await api.get<string[]>(`${BASE_URL}/my/job-ids`)
        return response.data
    },

    getMyApplications: async():Promise<ApplyResponse[]> => {
        const response = await api.get<ApplyResponse[]>(`${BASE_URL}/my`)
        return response.data
    }
}