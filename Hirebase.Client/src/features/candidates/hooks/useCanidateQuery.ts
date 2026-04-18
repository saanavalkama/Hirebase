import { useQuery } from "@tanstack/react-query"
import { candidateService } from "../services/candidateServices"

export const useCandidateProfileQuery =(userId:string) => {
    return useQuery({
        queryKey:["profile",userId],
        queryFn:()=>{
            return candidateService.getProfile()
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!userId
    })
}