import Login from '@/features/auth/components/Login';
import Register from '@/features/auth/components/Register';
import ProfileForm from '@/features/candidates/components/ProfileForm';
import CandidateDashboard from '@/features/candidates/pages/CandidateDashboard';
import LandingPage from '@/pages/LandingPage';
import {createBrowserRouter} from 'react-router-dom';


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
        path:"app/candidate/dashboard",
        element: <CandidateDashboard />
    },
    {
        path:"app/candidate/editProfile",
        element:<ProfileForm />
    }
])