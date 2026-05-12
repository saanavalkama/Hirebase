import { useQuery } from "@tanstack/react-query"
import { potentialMatchServices } from "../services/matchingService"
import { useMe } from "@/features/auth/hooks/useAuthQueries"

export const useMyMatches = () => {
    const { data: me } = useMe()
    return useQuery({
        queryKey: ["potentialMatches", me?.userId],
        queryFn:() => potentialMatchServices.getMyMatches(),
        enabled: !!me?.userId
    })
}