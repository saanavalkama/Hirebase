import type { LoginRequest, RegisterRequest } from "@/types/types"
import { useMutation } from "@tanstack/react-query"
import { authService } from "../services/authService"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { useAuthStore } from "@/store/authStore"

export const useLogin = () => {

    const setToken = useAuthStore(state => state.setToken)

    return useMutation({
       mutationFn: (data:LoginRequest) => authService.login(data),
       onSuccess:(data)=>{
            setToken(data.accessToken)
            toast.success("Login was succesfull")
       },
       onError: (err) => toast.error(getErrorMessage(err,"Something went wrong while logging in"))
    })
}

export const useRegister = () => {

    const setToken = useAuthStore(state => state.setToken)

    return useMutation({
        mutationFn: (data:RegisterRequest) => authService.register(data),
        onSuccess:(data)=>{
            setToken(data.accessToken)
            toast.success("Registration was succesfull")
        },
        onError:(err)=>toast.error(getErrorMessage(err, "Registering failed"))
    })
}