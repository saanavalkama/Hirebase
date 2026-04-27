import Login from '@/features/auth/components/Login';
import Register from '@/features/auth/components/Register';
import ProfileForm from '@/features/candidates/pages/ProfileForm';
import CandidateDashboard from '@/features/candidates/pages/CandidateDashboard';
import LandingPage from '@/pages/LandingPage';
import {createBrowserRouter} from 'react-router-dom';
import CandidateProtectedRoute from '@/features/auth/components/CandidateProtectedRoute';
import { Navigate } from 'react-router-dom';


export const router = createBrowserRouter([
    {
        path:"/",
        element: <LandingPage />
    },
    {
        path:"/register",
        element: <Register /> 
    },
    {
        path:"/login",
        element: <Login />
    },
    {
        path:"/app/candidate",
        element: <CandidateProtectedRoute />,
        children:[
            {index: true, element: <Navigate to="dashboard" />},
            {path:"dashboard", element: <CandidateDashboard />},
            {path:"profile", element:<ProfileForm />}
        ]
    }

])