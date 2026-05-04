import { Outlet,Navigate } from "react-router-dom";
import { useMe } from "../hooks/useAuthQueries";

export default function RecruiterProtectedRoute(){

    const {data:me, isPending, isError} = useMe()
    
    if(isPending) return <div>Loading...</div>
    if(isError || !me) return <Navigate to="/login" replace />
    if(me.role !== "RECRUITER") return <Navigate to="/" replace/>
    return <Outlet />
}