import { useMutation, useQueryClient } from "@tanstack/react-query"
import { candidateService } from "../services/candidateServices"
import type { UpdateCandidateProfileRequest } from "@/types/types"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { useMe } from "@/features/auth/hooks/useAuthQueries"
import axios from "axios"

export const useConnectGitHub = () => {
    return useMutation({
        mutationFn: () => candidateService.connectGitHub(),
        onError: (err) => {
            toast.error(getErrorMessage(err, "Failed to connect GitHub"))
        }
    })
}

export const useRefreshGitHub = () => {
    const queryClient = useQueryClient()
    const { data: me } = useMe()

    return useMutation({
        mutationFn: () => candidateService.refreshGitHubData(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", me?.userId] })
            toast.success("GitHub refresh queued")
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, "Failed to refresh GitHub data"))
        }
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    const { data: me } = useMe()
    
    return useMutation({
        mutationFn: (data: UpdateCandidateProfileRequest) => candidateService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", me?.userId] })
            toast.success("Profile updated")
        },
        onError: (err) => {
            if(axios.isAxiosError(err)){
                console.log(err.response?.data)
            }
            
            toast.error(getErrorMessage(err, "Profile update failed"))
        }
    })
}