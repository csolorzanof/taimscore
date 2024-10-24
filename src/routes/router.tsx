import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../views/LandindPage'
import TosPrivacy from '../views/TosPrivacy'
import Register from '../views/Register'
import PrivateRoute from './PrivateRoute'
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
import ImportData from '../views/Secure/ImportData'
import ImportDataMapping from '../views/Secure/ImportDataMapping'
import ConfirmDataMappings from '../views/Secure/ConfirmDataMappings'
import AssessmentImportDone from '../views/Secure/AssessmentImportDone'
import AssessmentProfileNew from '../views/Secure/AssessmentProfileNew'
import AssessmentProfileEdit from '../views/Secure/AssessmentProfileEdit'
import UserGroupCreate from '../views/Secure/UserGroupCreate'
import UserGroupEdit from '../views/Secure/UserGroupEdit'
import InviteUser from '../views/Secure/InviteUser'
import InviteAccept from '../views/InviteAccept'
import UserEdit from '../views/Secure/UserEdit'
import AssessmentFill from '../views/Secure/AssessmentFill'
import FeedbackForm from '../views/Secure/FeedbackForm'
import FeedbackFormFill from '../views/Secure/FeedbackFormFill'
import RecommendationView from '../views/Secure/RecommendationView'
import ReportCompliance from '../views/Secure/ReportCompliance'
import ReportScore from '../views/Secure/ReportScore'
import ReportMaturity from '../views/Secure/ReportMaturity'

const Router = createBrowserRouter([
    { path: '/', element: <LandingPage /> },
    { path: '/tos', element: <TosPrivacy /> },
    { path: '/privacy', element: <TosPrivacy /> },
    { path: '/register', element: <Register /> },
    { path: '/reset-password', element: <ResetPassword /> },
    { path: '/request-reset-password', element: <RequestResetPassword /> },
    { path: '/tenant-invite/:inviteCode', element: <InviteAccept /> },
    {
        path: '/secure',
        element: (
            <PrivateRoute>
                <AuthLayout />
            </PrivateRoute>
        ),
        children: [
            { path: 'landing', element: <Dashboard /> },
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'training', element: <Training /> },
            { path: 'assessment-profile', element: <AssessmentProfile /> },
            {
                path: 'assessment-profile/new',
                element: <AssessmentProfileNew />,
            },
            {
                path: 'assessment-profile/edit/:id',
                element: <AssessmentProfileEdit />,
            },
            { path: 'assessment', element: <Assessment /> },
            {
                path: 'assessment/fill/:assessmentId',
                element: <AssessmentFill />,
            },
            { path: 'reports', element: <Reports /> },
            { path: 'recommendation', element: <Recommendation /> },
            { path: 'knowledge-base', element: <Knowledgebase /> },
            { path: 'library', element: <Library /> },
            { path: 'configuration', element: <AdminConfiguration /> },
            { path: 'tenant-info', element: <AdminTenantInformation /> },
            { path: 'user-groups', element: <AdminUserGroups /> },
            { path: 'user-groups-create', element: <UserGroupCreate /> },
            { path: 'user-groups-edit/:id', element: <UserGroupEdit /> },
            { path: 'users', element: <AdminUsers /> },
            { path: 'users-invite', element: <InviteUser /> },
            { path: 'subscription', element: <AdminSubscription /> },
            { path: 'log-viewer', element: <AdminLogViewer /> },
            { path: 'import-data', element: <ImportData /> },
            { path: 'import-data/mapping', element: <ImportDataMapping /> },
            {
                path: 'import-data/mapping-confirm',
                element: <ConfirmDataMappings />,
            },
            {
                path: 'import-data/import-done',
                element: <AssessmentImportDone />,
            },
            { path: 'edit-user/:userId', element: <UserEdit /> },
            { path: 'feedback', element: <FeedbackForm /> },
            { path: 'feedback/:feedbackFormId', element: <FeedbackFormFill /> },
            {
                path: 'recommendation/view/:id',
                element: <RecommendationView />,
            },
            {
                path: 'reports/compliance/:id',
                element: <ReportCompliance />,
            },
            {
                path: 'reports/score/:id',
                element: <ReportScore />,
            },
            {
                path: 'reports/maturity/:id',
                element: <ReportMaturity />,
            },
        ],
    },
])

export default Router
