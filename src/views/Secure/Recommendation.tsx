import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { Button, Spinner } from '@material-tailwind/react'
import { AssessmentProfileDTO } from '../../DTOs/AssessmentProfileDTO'
import { AssessmentDTO } from '../../DTOs/FullAssessmentDTO'
import { useNavigate } from 'react-router-dom'

const Recommendation = () => {
    const navigate = useNavigate()
    const { token, user } = useContext(AuthContext)
    const [assessmentProfiles, setAssessmentProfiles] = useState<
        AssessmentProfileDTO[]
    >([])
    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
        null
    )
    const [assessments, setAssessments] = useState<AssessmentDTO[]>([])
    const [loadingAssessments, setLoadingAssessments] = useState(false)

    useEffect(() => {
        const fetchAssessmentProfiles = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/tenants/${
                        user?.tenantId
                    }/assessmentprofiles`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setAssessmentProfiles(response.data)
                } else {
                    console.error(
                        'Failed to fetch assessment profiles:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching assessment profiles:', error)
            }
        }

        fetchAssessmentProfiles()
    }, [token, user?.tenantId])

    const fetchAssessments = async (profileId: number) => {
        try {
            setLoadingAssessments(true)
            const response = await axios.get(
                `${
                    import.meta.env.VITE_BackendURL
                }/assessmentprofiles/${profileId}/assessments`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (response.status === 200) {
                setAssessments(response.data)
            } else {
                console.error(
                    'Failed to fetch assessments:',
                    response.statusText
                )
            }
            setLoadingAssessments(false)
        } catch (error) {
            setLoadingAssessments(false)
            console.error('Error fetching assessments:', error)
        }
    }

    const handleProfileChange = (profileId: number) => {
        setSelectedProfileId(profileId)
        fetchAssessments(profileId)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Select Assessment Profile
            </h1>
            <div className="mb-4">
                <select
                    value={selectedProfileId || ''}
                    onChange={(e) =>
                        handleProfileChange(Number(e.target.value))
                    }
                    className="mt-1 block w-full"
                >
                    <option value="" disabled>
                        Select an assessment profile
                    </option>
                    {assessmentProfiles.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                            {profile.profileName}
                        </option>
                    ))}
                </select>
            </div>
            {selectedProfileId && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Assessments</h2>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">
                                    Created Date
                                </th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingAssessments && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-2 px-2 border text-center"
                                    >
                                        <Spinner className="w-6 h-6" /> Loading
                                        Assessments...
                                    </td>
                                </tr>
                            )}
                            {!loadingAssessments &&
                                assessments.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-2 px-2 border text-center"
                                        >
                                            No assessments found
                                        </td>
                                    </tr>
                                )}
                            {!loadingAssessments &&
                                assessments.map((assessment) => (
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
                                        <td className="py-2 px-4 border-b">
                                            {new Date(
                                                assessment.createdDate
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <Button
                                                color="blue"
                                                onClick={() => {
                                                    navigate(
                                                        `/secure/recommendation/view/${assessment.id}`
                                                    )
                                                }}
                                            >
                                                View Recommendations
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Recommendation
