import { useMutation, useQueryClient } from "@tanstack/react-query"
import { candidateService } from "../services/candidateServices"
import type { UpdateCandidateProfileRequest } from "@/types/types"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils/getErrorMessage"

interface UseUpdateInputs extends UpdateCandidateProfileRequest{
    userId:string
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:({userId,...data}:UseUpdateInputs)=>candidateService.updateProfile(data),
        onSuccess:(_,{userId})=>{
            queryClient.invalidateQueries({queryKey:["profile",userId]})
            toast.success("Profile updated")
        },
        onError:(err) => toast.error(getErrorMessage(err,"Profile update failed"))

    })
}