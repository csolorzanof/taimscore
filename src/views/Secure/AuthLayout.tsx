import { Outlet, Link } from 'react-router-dom'
import {
    Navbar,
    Typography,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Drawer,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from '@material-tailwind/react'
import UserProfileIcon from '../../assets/user-circle.svg'
import LogoutIcon from '../../assets/logout-circle.svg'
import { useContext, useState } from 'react'
import { AuthContext } from '../../AuthProvider'
import DashboardIcon from '../../assets/dashboard-alt.svg'
import TrainingIcon from '../../assets/training.svg'
import AssessmentProfileIcon from '../../assets/assessment-profile.svg'
import AssessmentIcon from '../../assets/assessment.svg'
import ReportsIcon from '../../assets/reports.svg'
import RecommendationIcon from '../../assets/recommendation.svg'
import KnowledgebaseIcon from '../../assets/knowledge-base.svg'
import LibraryIcon from '../../assets/library.svg'
import AdminIcon from '../../assets/admin.svg'
import HamburgerIcon from '../../assets/hamburger.svg'
import ConfigurationIcon from '../../assets/configuration.svg'
import TenantInformationIcon from '../../assets/tenant-information.svg'
import UserGroupsIcon from '../../assets/user-groups.svg'
import UsersIcon from '../../assets/users.svg'
import SubscriptionIcon from '../../assets/subscription.svg'
import LogViewerIcon from '../../assets/log-viewer.svg'
import RightChevron from '../../assets/right-chevron.svg'
import DownChevron from '../../assets/down-chevron.svg'
import ImportIcon from '../../assets/import.svg'

const AuthLayout = () => {
    const { user, logout } = useContext(AuthContext)
    const [showDrawer, setShowDrawer] = useState(true)
    const [showAdmin, setShowAdmin] = useState(false)
    const closeDrawer = () => setShowDrawer(false)
    const openDrawer = () => setShowDrawer(true)
    const handleShowAdmin = () => setShowAdmin(!showAdmin)

    return (
        <div>
            <Navbar className="p-4 flex flex-row bg-blue-400 px-4 py-2 lg:px-8 lg:py-4">
                <div className="flex items-center">
                    <img
                        src={HamburgerIcon}
                        alt="Hamburger"
                        className="w-6 h-6 cursor-pointer"
                        onClick={openDrawer}
                    />
                </div>
                <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
                    <Typography className="mr-4 cursor-pointer py-1.5 font-bold text-lg">
                        <Link to="/secure/landing">TAIMSCORE</Link>
                    </Typography>
                </div>
                <Menu>
                    <MenuHandler>
                        <div className="flex flex-col w-28 text-center items-center">
                            <img
                                src={UserProfileIcon}
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                            <Typography className="text-sm font-light">{`${user?.name}`}</Typography>
                        </div>
                    </MenuHandler>
                    <MenuList className="w-28 bg-blue-700 text-white rounded-md">
                        {user?.authProviderId === 1 && (
                            <MenuItem>Change password</MenuItem>
                        )}
                        <MenuItem
                            className="flex flex-row p-2"
                            onClick={() => logout()}
                        >
                            <img
                                src={LogoutIcon}
                                alt="Logout"
                                className="w-4 h-4 mr-2"
                            />
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Navbar>

            <Drawer
                open={showDrawer}
                onClose={closeDrawer}
                className="flex flex-col gap-2 p-4 w-52 overflow-y-auto bg-blue-200"
            >
                <Link
                    to="/secure/dashboard"
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-blue-800"
                    onClick={closeDrawer}
                >
                    <img
                        src={DashboardIcon}
                        alt="Dashboard"
                        className="w-6 h-6"
                    />
                    <Typography>Dashboard</Typography>
                </Link>
                <Link
                    to="/secure/training"
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-blue-800"
                    onClick={closeDrawer}
                >
                    <img
                        src={TrainingIcon}
                        alt="Training"
                        className="w-6 h-6"
                    />
                    <Typography>Training</Typography>
                </Link>
                <Link
                    to="/secure/assessment-profile"
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-blue-800"
                    onClick={closeDrawer}
                >
                    <img
                        src={AssessmentProfileIcon}
                        alt="Assessment Profile"
                        className="w-6 h-6"
                    />
                    <Typography>Assessment Profile</Typography>
                </Link>
                <Link
                    to="/secure/assessment"
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-blue-800"
                    onClick={closeDrawer}
                >
                    <img
                        src={AssessmentIcon}
                        alt="Assessment"
                        className="w-6 h-6"
                    />
                    <Typography>Assessment</Typography>
                </Link>
                <Link
                    to="/secure/reports"
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-blue-800"
                    onClick={closeDrawer}
                >
                    <img src={ReportsIcon} alt="Reports" className="w-6 h-6" />
                    <Typography>Reports</Typography>
                </Link>
                <Link
                    to="/secure/recommendation"
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-blue-800"
                    onClick={closeDrawer}
                >
                    <img
                        src={RecommendationIcon}
                        alt="Recommendation"
                        className="w-6 h-6"
                    />
                    <Typography>Recommendation</Typography>
                </Link>
                <Link
                    to="/secure/knowledge-base"
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-blue-800"
                    onClick={closeDrawer}
                >
                    <img
                        src={KnowledgebaseIcon}
                        alt="Knowledge Base"
                        className="w-6 h-6"
                    />
                    <Typography>Knowledge Base</Typography>
                </Link>
                <Link
                    to="/secure/library"
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-blue-800"
                    onClick={closeDrawer}
                >
                    <img src={LibraryIcon} alt="Library" className="w-6 h-6" />
                    <Typography>Library</Typography>
                </Link>
                <div>
                    <Accordion open={showAdmin}>
                        <AccordionHeader
                            onClick={handleShowAdmin}
                            className="shadow-md flex flex-row gap-2 p-4 hover:bg-blue-800"
                        >
                            <img
                                src={AdminIcon}
                                alt="Admin"
                                className="w-6 h-6"
                            />
                            <Typography>Admin</Typography>
                            {!showAdmin && (
                                <img
                                    src={RightChevron}
                                    alt="Right Chevron"
                                    className="w-4 h-4"
                                />
                            )}
                            {showAdmin && (
                                <img
                                    src={DownChevron}
                                    alt="Down Chevron"
                                    className="w-4 h-4"
                                />
                            )}
                        </AccordionHeader>
                        <AccordionBody
                            className={'overflow-hidden bg-blue-200'}
                        >
                            <Link
                                to="/secure/configuration"
                                className="text-sm shadow-md flex flex-row gap-2 p-4 hover:bg-blue-300"
                                onClick={closeDrawer}
                            >
                                <img
                                    src={ConfigurationIcon}
                                    alt="Configuration"
                                    className="w-4 h-4"
                                />
                                Configuration
                            </Link>
                            <Link
                                to="/secure/tenant-info"
                                className="text-sm shadow-md flex flex-row gap-2 p-4 hover:bg-blue-300"
                                onClick={closeDrawer}
                            >
                                <img
                                    src={TenantInformationIcon}
                                    alt="Tenant Information"
                                    className="w-4 h-4"
                                />
                                Tenant Information
                            </Link>
                            <Link
                                to="/secure/user-groups"
                                className="text-sm shadow-md flex flex-row gap-2 p-4 hover:bg-blue-300"
                                onClick={closeDrawer}
                            >
                                <img
                                    src={UserGroupsIcon}
                                    alt="User Groups"
                                    className="w-4 h-4"
                                />
                                User Groups
                            </Link>
                            <Link
                                to="/secure/users"
                                className="text-sm shadow-md flex flex-row gap-2 p-4 hover:bg-blue-300"
                                onClick={closeDrawer}
                            >
                                <img
                                    src={UsersIcon}
                                    alt="Users"
                                    className="w-4 h-4"
                                />
                                Users
                            </Link>
                            <Link
                                to="/secure/import-data"
                                className="text-sm shadow-md flex flex-row gap-2 p-4 hover:bg-blue-300"
                                onClick={closeDrawer}
                            >
                                <img
                                    src={ImportIcon}
                                    alt="Import"
                                    className="w-4 h-4"
                                />
                                Import Data
                            </Link>
                            <Link
                                to="/secure/subscription"
                                className="text-sm shadow-md flex flex-row gap-2 p-4 hover:bg-blue-300"
                                onClick={closeDrawer}
                            >
                                <img
                                    src={SubscriptionIcon}
                                    alt="Subscription"
                                    className="w-4 h-4"
                                />
                                Subscription
                            </Link>
                            <Link
                                to="/secure/log-viewer"
                                className="text-sm shadow-md flex flex-row gap-2 p-4 hover:bg-blue-300"
                                onClick={closeDrawer}
                            >
                                <img
                                    src={LogViewerIcon}
                                    alt="Log Viewer"
                                    className="w-4 h-4"
                                />
                                Log Viewer
                            </Link>
                        </AccordionBody>
                    </Accordion>
                </div>
                {/*
                Configuration
                Tenant Information
                User Groups
                Users
                Subscription
                Log Viewer
                 */}
            </Drawer>
            <Outlet />
        </div>
    )
}

export default AuthLayout
