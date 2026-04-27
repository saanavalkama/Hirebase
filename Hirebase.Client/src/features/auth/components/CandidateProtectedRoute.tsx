import { Outlet,Navigate } from "react-router-dom";
import { useMe } from "../hooks/useAuthQueries";

export default function CandidateProtectedRoute(){

    const {data:me, isPending, isError} = useMe()
    
    if(isPending) return <div>Loading...</div>
    if(isError || !me) return <Navigate to="/login" replace />
    return <Outlet />
}