import { Outlet, Link } from 'react-router-dom'
import {
    Navbar,
    Typography,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Drawer,
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

const AuthLayout = () => {
    const { user, logout } = useContext(AuthContext)
    const [showDrawer, setShowDrawer] = useState(true)
    const closeDrawer = () => setShowDrawer(false)
    const openDrawer = () => setShowDrawer(true)

    return (
        <div>
            <Navbar className="mx-auto flex flex-row bg-blue-400 max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
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
                className="flex flex-col gap-2 p-4 w-52 bg-sky-600"
            >
                <Link
                    to="/secure/dashboard"
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-sky-800"
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
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-sky-800"
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
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-sky-800"
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
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-sky-800"
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
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-sky-800"
                >
                    <img src={ReportsIcon} alt="Reports" className="w-6 h-6" />
                    <Typography>Reports</Typography>
                </Link>
                <Link
                    to="/secure/recommendation"
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-sky-800"
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
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-sky-800"
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
                    className="shadow-md flex flex-row gap-2 p-4 hover:bg-sky-800"
                >
                    <img src={LibraryIcon} alt="Library" className="w-6 h-6" />
                    <Typography>Library</Typography>
                </Link>
            </Drawer>
            <Outlet />
        </div>
    )
}

export default AuthLayout
