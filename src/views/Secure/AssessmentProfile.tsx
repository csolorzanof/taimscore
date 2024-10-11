import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { AssessmentProfileDTO } from '../../DTOs/AssessmentProfileDTO'
import { useNavigate } from 'react-router-dom'
import { AlertsContext } from '../../components/alerts/Alerts-Context'
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from '@material-tailwind/react'

const AssessmentProfile = () => {
    const { token, user } = useContext(AuthContext)
    const { addAlert } = useContext(AlertsContext)
    const [assessmentProfiles, setAssessmentProfiles] = useState<
        AssessmentProfileDTO[]
    >([])
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
        null
    )
    const navigate = useNavigate()

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

    const handleDelete = async () => {
        if (!selectedProfileId) return

        try {
            const response = await axios.delete(
                `${
                    import.meta.env.VITE_BackendURL
                }/assessmentprofiles/${selectedProfileId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (response.status === 200) {
                setAssessmentProfiles((prevProfiles) =>
                    prevProfiles.filter(
                        (profile) => profile.id !== selectedProfileId
                    )
                )
                addAlert({
                    id: 'assessment-profile-deleted',
                    severity: 'success',
                    message: 'Assessment profile deleted successfully',
                    timeout: 5,
                    handleDismiss: null,
                })
            } else {
                console.error(
                    'Failed to delete assessment profile:',
                    response.statusText
                )
                addAlert({
                    id: 'assessment-profile-delete-failed',
                    severity: 'error',
                    message: 'Failed to delete assessment profile',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        } catch (error) {
            console.error('Error deleting assessment profile:', error)
            addAlert({
                id: 'assessment-profile-delete-error',
                severity: 'error',
                message:
                    'An error occurred while deleting the assessment profile',
                timeout: 5,
                handleDismiss: null,
            })
        } finally {
            setOpenDialog(false)
            setSelectedProfileId(null)
        }
    }

    const openDeleteDialog = (id: number) => {
        setSelectedProfileId(id)
        setOpenDialog(true)
    }

    const handleCreateNewProfile = () => {
        navigate('/secure/assessment-profile/new')
    }

    const handleEdit = (profileId: number) => {
        navigate(`/secure/assessment-profile/edit/${profileId}`)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Assessment Profiles</h1>
            <button
                onClick={handleCreateNewProfile}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
                Create New Assessment Profile
            </button>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">
                            Organization Size
                        </th>
                        <th className="py-2 px-4 border-b">Industry Group</th>
                        <th className="py-2 px-4 border-b">Revenue Level</th>
                        <th className="py-2 px-4 border-b">Country</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assessmentProfiles.map((profile) => (
                        <tr key={profile.id}>
                            <td className="py-2 px-4 border-b">
                                {profile.profileName}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {profile.orgSizeDescription}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {profile.industryGroupName}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {profile.revLevelDescription}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {profile.countryName}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleEdit(profile.id!)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() =>
                                        openDeleteDialog(profile.id!)
                                    }
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Dialog open={openDialog} handler={setOpenDialog}>
                <DialogHeader>Confirm Delete</DialogHeader>
                <DialogBody>
                    Are you sure you want to delete this assessment profile?
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setOpenDialog(false)}
                        className="mr-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={handleDelete}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    )
}

export default AssessmentProfile
