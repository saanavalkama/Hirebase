import { api } from "@/lib/api"
import { type PotentialMatchResponse } from "@/types/types"

const BASE_URL = `/api/potential-match`

export const potentialMatchServices = {
    getMyMatches: async (): Promise<PotentialMatchResponse[]> => {
        const response = await api.get<PotentialMatchResponse[]>(`${BASE_URL}/my`)
        return response.data
    }
}