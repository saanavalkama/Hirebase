import { api } from "@/lib/api";
import type { CreateOrganizationRequest, OrganizationResponse, UpdateOrganizationRequest } from "@/types/types";

const BASE_URL = "/api/recruiter/organizations"

export const organizationServices = {

    createOrganization: async(data:CreateOrganizationRequest):Promise<OrganizationResponse>=>{
        const response = await api.post<OrganizationResponse>(BASE_URL,data)
        return response.data
    },

    getOwnOrganizations: async():Promise<OrganizationResponse[]>=>{
        const response = await api.get<OrganizationResponse[]>(BASE_URL)
        return response.data
    },

    updateOrganization: async(data:UpdateOrganizationRequest):Promise<OrganizationResponse>=>{
        const {id, ...payload} = data
        const response = await api.patch<OrganizationResponse>(`${BASE_URL}/${id}`,payload)
        return response.data


    },

    deleteOrganization:async(id:string)=>{
        await api.delete(`${BASE_URL}/${id}`)
    }
}