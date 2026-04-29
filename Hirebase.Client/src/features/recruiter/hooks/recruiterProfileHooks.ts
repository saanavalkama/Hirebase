import type { CreateRecruiterProfileRequest, UpdateCandidateProfileRequest, UpdateRecruiterProfileRequest } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { recuiterServices } from "../services/recruiterServices"
import { useMe } from "@/features/auth/hooks/useAuthQueries"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils/getErrorMessage"
import axios from "axios"


export const useRecruiterProfileQuery = () => {
    const {data:me} = useMe()
    return useQuery({
        queryKey:["recruiterProfile",me?.userId],
        queryFn: async () => {
            try {
                return await recuiterServices.getOwnProfile()
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 404) return null
                throw err
            }
        },
        enabled: !!me?.userId,
        staleTime: 1000 * 60 * 5,
        retry: false
    })
}

export const useCreateRecruiterProfile = () => {
    const {data:me} = useMe()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(data:CreateRecruiterProfileRequest) => recuiterServices.createRecruiterProfile(data),
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:["recruiterProfile",me?.userId]})
            toast.success("Profile created")
        },
        onError:(err)=>toast.error(getErrorMessage(err,"Profile creation failed"))
    })
}

export const useUpdateRecruiterProfile = () => {
    const {data:me} = useMe()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(data:UpdateRecruiterProfileRequest) => recuiterServices.updateRecruiterProfile(data),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["recruiterProfile",me?.userId]})
            toast.success("Profile updated")
        },
        onError:(err)=>toast.error(getErrorMessage(err,"Profile update failed"))
    })
}

export const useRecruiterProfileDeletion = () => {
    const {data:me} = useMe()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:()=>recuiterServices.deleteOwnRecruiterProfile(),
        onSuccess:()=>{
            queryClient.removeQueries({queryKey:["recruiterProfile", me?.userId]})
            toast.success("Profile deleted")
        },
        onError:(err)=>toast.error(getErrorMessage(err, "Profile deletion failed"))
    })
}