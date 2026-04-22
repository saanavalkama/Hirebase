import Login from '@/features/auth/components/Login';
import Register from '@/features/auth/components/Register';
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
    }
])