import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { DashboardDTO } from '../../DTOs/DashboardDTO'
import { Spinner } from '@material-tailwind/react'

const Dashboard = () => {
    const { token, user } = useContext(AuthContext)
    const [dashboardData, setDashboardData] = useState<DashboardDTO | null>(
        null
    )
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/tenants/${
                        user?.tenantId
                    }/dashboard`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setDashboardData(response.data)
                } else {
                    console.error(
                        'Failed to fetch dashboard data:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            }
        }

        fetchDashboardData()
    }, [token, user?.tenantId])

    if (!dashboardData) {
        return (
            <div className="container mx-auto flex flex-col items-center justify-center p-8">
                <Spinner color="blue" className="w-16 h-16" />
                Loading...
            </div>
        )
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = dashboardData.assessments.slice(
        indexOfFirstItem,
        indexOfLastItem
    )
    const totalPages = Math.ceil(
        dashboardData.assessments.length / itemsPerPage
    )

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-700 text-white p-4 rounded shadow text-center">
                    <h2 className="text-xl font-bold">Total Users</h2>
                    <p className="text-2xl">{dashboardData.totalUsers}</p>
                </div>
                <div className="bg-yellow-600 p-4 rounded shadow text-center">
                    <h2 className="text-xl font-bold">Total Groups</h2>
                    <p className="text-2xl">{dashboardData.totalGroups}</p>
                </div>
                <div className="bg-gray-700 text-white p-4 rounded shadow text-center">
                    <h2 className="text-xl font-bold">
                        Total Assessment Profiles
                    </h2>
                    <p className="text-2xl">
                        {dashboardData.totalAssessmentProfiles}
                    </p>
                </div>
                <div className="bg-orange-500 p-4 rounded shadow text-center">
                    <h2 className="text-xl font-bold">Active Assessments</h2>
                    <p className="text-2xl">
                        {dashboardData.inProgressAssessments}
                    </p>
                </div>
                <div className="bg-green-600 text-white p-4 rounded shadow text-center">
                    <h2 className="text-xl font-bold">Completed Assessments</h2>
                    <p className="text-2xl">
                        {dashboardData.completedAssessments}
                    </p>
                </div>
                <div className="bg-red-800 text-white p-4 rounded shadow text-center">
                    <h2 className="text-xl font-bold">Total Assessments</h2>
                    <p className="text-2xl">{dashboardData.totalAssessments}</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Assessment Info</h2>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">
                                Overall Score
                            </th>
                            <th className="py-2 px-4 border-b">Top 20 Score</th>
                            <th className="py-2 px-4 border-b">Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((assessment) => (
                            <tr key={assessment.id}>
                                <td className="py-2 px-4 border-b">
                                    {assessment.id}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {assessment.assessmentName}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {assessment.isCompleted
                                        ? 'Completed'
                                        : 'In Progress'}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    {(assessment.overallRating * 100).toFixed(
                                        2
                                    )}
                                    %
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    {(
                                        assessment.top20ControlsRating * 100
                                    ).toFixed(2)}
                                    %
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {new Date(
                                        assessment.createdDate
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`mx-1 px-3 py-1 rounded ${
                                currentPage === i + 1
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
