import { api } from "@/lib/api";
import type { CreateJobPostingRequest, JobPostingResponse, UpdateJobPostingRequest } from "@/types/types";

const BASE_URL = "/api/recruiter/jobpostings"

export const jobPostingServices = {

    createJobPosting:async(data:CreateJobPostingRequest):Promise<JobPostingResponse>=>{
        const response = await api.post<JobPostingResponse>(BASE_URL,data)
        return response.data
    },

    getRecruitersPostings:async():Promise<JobPostingResponse[]>=>{
        const response = await api.get<JobPostingResponse[]>(BASE_URL)
        return response.data
    },

    getPostingById: async(id:string):Promise<JobPostingResponse>=>{
        const response = await api.get<JobPostingResponse>(`${BASE_URL}/${id}`)
        return response.data
    },

    updatePosting:async(data:UpdateJobPostingRequest):Promise<JobPostingResponse>=>{
        const {id,...payload} = data
        const response = await api.patch<JobPostingResponse>(`${BASE_URL}/${id}`,payload)
        return response.data
    },

    deletePosting:async(id:string)=>{
        await api.delete(`${BASE_URL}/${id}`)
    }

}