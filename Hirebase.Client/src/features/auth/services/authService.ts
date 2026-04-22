import type { AuthResponse, LoginRequest, MeResponse, RegisterRequest } from "@/types/types";
import {api} from '../../../lib/api'

export const authService = {

    register: async(data: RegisterRequest):Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/api/auth/register",data)
        return response.data
    },

    login:async(data:LoginRequest):Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/api/auth/login", data)
        return response.data
    },

    me: async():Promise<MeResponse>=>{
        const response = await api.get<MeResponse>("api/auth/me")
        return response.data
    }


}