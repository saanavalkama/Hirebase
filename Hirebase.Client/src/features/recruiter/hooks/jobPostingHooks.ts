import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { jobPostingServices } from "../services/jobPostingServices"
import { useMe } from "@/features/auth/hooks/useAuthQueries"
import type { CreateJobPostingRequest, UpdateJobPostingRequest } from "@/types/types"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils/getErrorMessage"

export const useRecruitersPostings = () => {
    const { data: me } = useMe()
    return useQuery({
        queryKey: ["jobPostings", me?.userId],
        queryFn: () => jobPostingServices.getRecruitersPostings(),
        enabled: !!me?.userId,
        staleTime: 1000 * 60 * 5
    })
}

export const useJobPostingById = (id: string) => {
    return useQuery({
        queryKey: ["jobPosting", id],
        queryFn: () => jobPostingServices.getPostingById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5
    })
}

export const useCreateJobPosting = () => {
    const { data: me } = useMe()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateJobPostingRequest) => jobPostingServices.createJobPosting(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobPostings", me?.userId] })
            toast.success("Job posting created")
        },
        onError: (err) => toast.error(getErrorMessage(err, "Failed to create job posting"))
    })
}

export const useUpdateJobPosting = () => {
    const { data: me } = useMe()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateJobPostingRequest) => jobPostingServices.updatePosting(data),
        onSuccess: (updatedPosting) => {
            queryClient.invalidateQueries({ queryKey: ["jobPostings", me?.userId] })
            queryClient.invalidateQueries({ queryKey: ["jobPosting", updatedPosting.id] })
            toast.success("Job posting updated")
        },
        onError: (err) => toast.error(getErrorMessage(err, "Failed to update job posting"))
    })
}

export const useDeleteJobPosting = () => {
    const { data: me } = useMe()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => jobPostingServices.deletePosting(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["jobPostings", me?.userId] })
            queryClient.removeQueries({ queryKey: ["jobPosting", id] })
            toast.success("Job posting deleted")
        },
        onError: (err) => toast.error(getErrorMessage(err, "Failed to delete job posting"))
    })
}