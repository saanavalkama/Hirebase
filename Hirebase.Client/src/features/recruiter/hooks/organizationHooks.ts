import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { organizationServices } from "../services/organizationServices"
import { useMe } from "@/features/auth/hooks/useAuthQueries"
import type { CreateOrganizationRequest, UpdateOrganizationRequest } from "@/types/types"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils/getErrorMessage"

export const useOwnOrganizations = () => {
    const {data:me} = useMe()
    return useQuery({
        queryKey: ["organizations",me?.userId],
        queryFn:()=> organizationServices.getOwnOrganizations(),
        enabled: !!me?.userId,
        staleTime: 1000 * 60 * 5
    })
}

export const useCreateOrganization = () => {
    const {data:me} = useMe()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(data:CreateOrganizationRequest) => organizationServices.createOrganization(data),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["organizations",me?.userId]})
            toast.success("Organization created")
        },
        onError:(err)=> toast.error(getErrorMessage(err, "Failed to create the organization"))
    })
}

export const useUpdateOrganization = () => {
    const {data:me} = useMe()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(data:UpdateOrganizationRequest)=>organizationServices.updateOrganization(data),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["organizations",me?.userId]})
            toast.success("Organization updated")
        },
        onError:(err)=>toast.error(getErrorMessage(err,"Failed to update organization"))
    })
}

export const useDeleteOrganization = () => {
    const {data:me} = useMe()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(id:string)=>organizationServices.deleteOrganization(id),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["organizations",me?.userId]})
            toast.success("Organization deleted")
        },
        onError:(err)=>toast.error(getErrorMessage(err,"Deletion failed"))
    })
}