import type { InboxRequest, JobPostingRequest, UpdateApplicationRequest, UpdateStageMutationProps } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { applicationServices } from "../services/applicationServices"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { useMe } from "@/features/auth/hooks/useAuthQueries"

export const useApply = () => {
    const queryClient = useQueryClient()
    const {data:me} = useMe()
    return useMutation({
        mutationFn:(data:JobPostingRequest) => applicationServices.apply(data),
        onSuccess:(data) => {
            toast.success(`Congratulations ${data.candidateName}! You succesfully
                applied to ${data.jobTitle} at ${data.organizationName
                }`)   
            queryClient.invalidateQueries({queryKey:['candidateAppliedJobIds',me?.userId]})
            queryClient.invalidateQueries({queryKey:['applications',me?.userId]})  
        },
        onError:(err) => {
            if(isAxiosError(err) && err.status == 409){
                toast.error("You have already applied to this position")
            }
            else{
                toast.error(getErrorMessage(err,"Failed to apply"))
            }
        }
    })
}

export const useGetAllJobIds = () => {
    const {data:me} = useMe()
    return useQuery({
        queryKey:['candidateAppliedJobIds',me?.userId],
        queryFn:()=>applicationServices.getAllJobIds(),
        enabled: !!me,
        staleTime: 1000 * 60 *5
    })
}

export const getMyApplications = () => {
    const {data: me} = useMe()
    return useQuery({
        queryKey:['applications',me?.userId],
        queryFn:()=>applicationServices.getMyApplications(),
        enabled: !!me,
        staleTime: 1000 * 60 * 5
    })
}

export const useInbox = (data:InboxRequest) => {
    const {data: me} = useMe()
    return useQuery({
        queryKey:['inbox', me?.userId, data.jobPostingId, data.page, data.pageSize],
        queryFn:() => applicationServices.getInbox(data),
        enabled:!!me && !!data.jobPostingId,
        staleTime:1000*60*5
    })
}

export const usePipeline = (data:JobPostingRequest) => {
    const {data:me} = useMe()
    return useQuery({
        queryKey:['pipeline',me?.userId,data.jobPostingId],
        queryFn:()=>applicationServices.getPipeline(data),
        enabled:!!me && !!data,
        staleTime: 1000 * 60 * 5
    })
}

export const useUpdateApplicationStage = (data:UpdateStageMutationProps) => {
    const queryClient = useQueryClient()
    const {data:me} = useMe()
    return useMutation({
        mutationFn:(data:UpdateApplicationRequest)=>applicationServices.updateApplicationStage(data),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['pipeline',me?.userId,data.jobPostingId]})
            queryClient.invalidateQueries({queryKey:['inbox',me?.userId,data.jobPostingId]})
            toast.success("Update was succesfull")
        },
        onError:(err)=>{
            //makes sure optimistic UI rolls back
            queryClient.invalidateQueries({ queryKey: ['pipeline', me?.userId, data.jobPostingId] })
            queryClient.invalidateQueries({ queryKey: ['inbox', me?.userId, data.jobPostingId] })
            toast.error(getErrorMessage(err,"Something went wrong while updating the stage"))}

    })
}

export const useWithdraw = () => {
    const {data:me} = useMe()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(data:JobPostingRequest) => applicationServices.withdrawn(data),
        onSuccess:()=>{
            toast.success("You have succesfully withdrawn your application")
            queryClient.invalidateQueries({queryKey:['candidateAppliedJobIds',me?.userId]})
            queryClient.invalidateQueries({queryKey:['applications',me?.userId]}) 

        },
        onError:(err)=>toast.error(getErrorMessage(err, "something went wrong while withdrawing the application"))
    })
}