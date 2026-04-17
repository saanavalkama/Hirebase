import axios from 'axios'
import { env } from '@/config/env'
import { useAuthStore } from '@/store/authStore'
import type { AuthResponse } from '@/types/types'

export const api = axios.create({
    baseURL: env.apiBaseUrl,
    withCredentials: true
})

api.interceptors.request.use((config)=>{
    const token = useAuthStore.getState().accessToken
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if(axios.isAxiosError(error) &&
        error.response?.status === 401 && 
        !originalRequest._retry
        ){
            originalRequest._retry = true

            try{
                const response = await api.post<AuthResponse>("/api/auth/refresh")
                const newToken = response.data.accessToken
                useAuthStore.getState().setToken(newToken)
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return api(originalRequest)
            } catch (err){
                useAuthStore.getState().clearToken()
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)