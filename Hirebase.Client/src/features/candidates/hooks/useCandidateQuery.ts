import { useQuery } from "@tanstack/react-query"
import { candidateService } from "../services/candidateServices"
import { useMe } from "@/features/auth/hooks/useAuthQueries"

export const useCandidateProfile =() => {

    const {data:me} = useMe()
    
    return useQuery({
        queryKey:["profile",me?.userId],
        queryFn:()=>{
            return candidateService.getProfile()
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!me?.userId
    })
}