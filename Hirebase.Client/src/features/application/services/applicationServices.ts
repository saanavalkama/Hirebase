import { api } from "@/lib/api"
import {type InboxFeedResponse, type InboxRequest, type JobPostingRequest, type ApplyResponse, type RecruiterApplicationResponse } from "@/types/types"

const BASE_URL = `/api/application`

export const applicationServices = {

    apply: async(data:JobPostingRequest):Promise<ApplyResponse> => {
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
    },

    getInbox: async(data:InboxRequest):Promise<InboxFeedResponse>=>{
        const response = await api.get<InboxFeedResponse>(`${BASE_URL}/recruiter/${data.jobPostingId}/applied`, {
            params: { page: data.page, pageSize: data.pageSize }
        })
        return response.data
    },

    getPipeline: async(data:JobPostingRequest):Promise<RecruiterApplicationResponse[]> => {
        const response = await api.get<RecruiterApplicationResponse[]>(`${BASE_URL}/recruiter/${data.jobPostingId}/pipeline`)
        return response.data
    }
}