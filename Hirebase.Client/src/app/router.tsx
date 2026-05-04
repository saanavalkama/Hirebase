import Login from '@/features/auth/components/Login';
import Register from '@/features/auth/components/Register';
import ProfileForm from '@/features/candidates/pages/ProfileForm';
import CandidateDashboard from '@/features/candidates/pages/CandidateDashboard';
import LandingPage from '@/pages/LandingPage';
import {createBrowserRouter} from 'react-router-dom';
import CandidateProtectedRoute from '@/features/auth/components/CandidateProtectedRoute';
import { Navigate } from 'react-router-dom';
import RecruiterProtectedRoute from '@/features/auth/components/RecruiterProtectedRoute';
import RecruiterDashboard from '@/features/recruiter/pages/Dashboard';
import Profile from '@/features/recruiter/pages/Profile';
import OrganizationPage from '@/features/recruiter/pages/OrganizationPage';
import JobPosting from '@/features/recruiter/pages/JobPosting'
import JobPostingsList from '@/features/recruiter/pages/JobPostingsList';


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
    },
    {
        path:"/app/recruiter",
        element: <RecruiterProtectedRoute />,
        children:[
            {index: true, element: <Navigate to="dashboard" />},
            {path:"dashboard", element: <RecruiterDashboard/>},
            {path:"profile/edit", element:<Profile />},
            {path:"organizations",element:<OrganizationPage /> },
            {path:"jobPosting", element:<JobPosting />},
            {path:"jobPostings", element:<JobPostingsList />}
        ]
        
    }

])