import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from '@material-tailwind/react'
import { UserGroupDTO } from '../../DTOs/UserGroupDTO'
import { AlertsContext } from '../../components/alerts/Alerts-Context'

const AdminUserGroups = () => {
    const { token, user } = useContext(AuthContext)
    const { addAlert } = useContext(AlertsContext)
    const [userGroups, setUserGroups] = useState<UserGroupDTO[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/tenants/${
                        user?.tenantId
                    }/usergroups`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setUserGroups(response.data)
                } else {
                    console.error(
                        'Failed to fetch user groups:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching user groups:', error)
            }
        }

        fetchUserGroups()
    }, [token, user?.tenantId])

    const handleDelete = async () => {
        if (!selectedGroupId) return

        try {
            const response = await axios.delete(
                `${
                    import.meta.env.VITE_BackendURL
                }/usergroups/${selectedGroupId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (response.status === 200) {
                setUserGroups((prevGroups) =>
                    prevGroups.filter((group) => group.id !== selectedGroupId)
                )
                console.log('User group deleted successfully')
                addAlert({
                    id: 'user-group-deleted',
                    severity: 'success',
                    message: 'User group deleted successfully',
                    timeout: 5,
                    handleDismiss: null,
                })
            } else {
                console.error(
                    'Failed to delete user group:',
                    response.statusText
                )
                addAlert({
                    id: 'user-group-delete-failed',
                    severity: 'error',
                    message: 'Failed to delete user group',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        } catch (error) {
            console.error('Error deleting user group:', error)
            addAlert({
                id: 'user-group-delete-error',
                severity: 'error',
                message: 'An error occurred while deleting the user group',
                timeout: 5,
                handleDismiss: null,
            })
        } finally {
            setOpenDialog(false)
            setSelectedGroupId(null)
        }
    }

    const openDeleteDialog = (id: number) => {
        setSelectedGroupId(id)
        setOpenDialog(true)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Groups</h1>
            <Button
                onClick={() => navigate('/secure/user-groups-create')}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
                Create New User Group
            </Button>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Group Name</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userGroups.map((group) => (
                        <tr key={group.id}>
                            <td className="py-2 px-4 border-b">
                                {group.groupName}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <Button
                                    onClick={() =>
                                        navigate(
                                            `/secure/user-groups-edit/${group.id}`
                                        )
                                    }
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => openDeleteDialog(group.id!)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Dialog open={openDialog} handler={setOpenDialog}>
                <DialogHeader>Confirm Delete</DialogHeader>
                <DialogBody>
                    Are you sure you want to delete this user group?
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

export default AdminUserGroups
