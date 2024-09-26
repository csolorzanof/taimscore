import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../views/LandindPage'
import TosPrivacy from '../views/TosPrivacy'
import Register from '../views/Register'
import PrivateRoute from './PrivateRoute'
import SecureLandingPage from '../views/Secure/SecureLandingPage'
import ResetPassword from '../views/ResetPassword'
import RequestResetPassword from '../views/RequestResetPassword'
import AuthLayout from '../views/Secure/AuthLayout'
import Dashboard from '../views/Secure/Dashboard'
import Training from '../views/Secure/Training'
import AssessmentProfile from '../views/Secure/AssessmentProfile'
import Assessment from '../views/Secure/Assessment'
import Recommendation from '../views/Secure/Recommendation'
import Knowledgebase from '../views/Secure/Knowledgebase'
import Reports from '../views/Secure/Reports'
import Library from '../views/Secure/Library'

const Router = createBrowserRouter([
    { path: '/', element: <LandingPage /> },
    { path: '/tos', element: <TosPrivacy /> },
    { path: '/privacy', element: <TosPrivacy /> },
    { path: '/register', element: <Register /> },
    { path: '/reset-password', element: <ResetPassword /> },
    { path: '/request-reset-password', element: <RequestResetPassword /> },
    {
        path: '/secure',
        element: (
            <PrivateRoute>
                <AuthLayout />
            </PrivateRoute>
        ),
        children: [
            { path: 'landing', element: <SecureLandingPage /> },
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'training', element: <Training /> },
            { path: 'assessment-profile', element: <AssessmentProfile /> },
            { path: 'assessment', element: <Assessment /> },
            { path: 'reports', element: <Reports /> },
            { path: 'recommendation', element: <Recommendation /> },
            { path: 'knowledgebase', element: <Knowledgebase /> },
            { path: 'library', element: <Library /> },
        ],
    },
])

export default Router
