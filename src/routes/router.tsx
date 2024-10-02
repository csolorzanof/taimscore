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
import AdminConfiguration from '../views/Secure/AdminConfiguration'
import AdminTenantInformation from '../views/Secure/AdminTenantInformation'
import AdminUserGroups from '../views/Secure/AdminUserGroups'
import AdminUsers from '../views/Secure/AdminUsers'
import AdminSubscription from '../views/Secure/AdminSubscription'
import AdminLogViewer from '../views/Secure/AdminLogViewer'

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
            { path: 'knowledge-base', element: <Knowledgebase /> },
            { path: 'library', element: <Library /> },
            { path: 'configuration', element: <AdminConfiguration /> },
            { path: 'tenant-info', element: <AdminTenantInformation /> },
            { path: 'user-groups', element: <AdminUserGroups /> },
            { path: 'users', element: <AdminUsers /> },
            { path: 'subscription', element: <AdminSubscription /> },
            { path: 'log-viewer', element: <AdminLogViewer /> },
        ],
    },
])

export default Router
