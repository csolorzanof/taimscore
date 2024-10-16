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
import { UserDTO } from '../../DTOs/UserDTO'
import { InviteDTO } from '../../DTOs/InviteDTO'
import { AlertsContext } from '../../components/alerts/Alerts-Context'

const AdminUsers = () => {
    const { token, user } = useContext(AuthContext)
    const [pendingInvites, setPendingInvites] = useState<InviteDTO[]>([])
    const [activeUsers, setActiveUsers] = useState<UserDTO[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [openInviteDialog, setOpenInviteDialog] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
    const [selectedInviteId, setSelectedInviteId] = useState<number | null>(
        null
    )
    const { addAlert } = useContext(AlertsContext)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPendingInvites = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/tenants/${
                        user?.tenantId
                    }/activeinvites`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setPendingInvites(response.data)
                } else {
                    console.error(
                        'Failed to fetch pending invites:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching pending invites:', error)
            }
        }

        const fetchActiveUsers = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/tenants/${
                        user?.tenantId
                    }/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setActiveUsers(response.data)
                } else {
                    console.error(
                        'Failed to fetch active users:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching active users:', error)
            }
        }

        fetchPendingInvites()
        fetchActiveUsers()
    }, [token, user?.tenantId])

    const handleDeleteUser = async () => {
        if (!selectedUserId) return

        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BackendURL}/tenants/${
                    user?.tenantId
                }/users/${selectedUserId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (response.status === 200) {
                setActiveUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== selectedUserId)
                )
                addAlert({
                    id: 'user-deleted',
                    severity: 'success',
                    message: 'User removed successfully',
                    timeout: 5,
                    handleDismiss: null,
                })
            } else {
                console.error('Failed to remove user:', response.statusText)
                addAlert({
                    id: 'user-delete-failed',
                    severity: 'error',
                    message: 'Failed to remove user',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        } catch (error) {
            console.error('Error removing user:', error)
        } finally {
            setOpenDialog(false)
            setSelectedUserId(null)
        }
    }

    const handleDeleteInvite = async () => {
        if (!selectedInviteId) return

        try {
            const response = await axios.delete(
                `${
                    import.meta.env.VITE_BackendURL
                }/invites/${selectedInviteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (response.status === 200) {
                setPendingInvites((prevInvites) =>
                    prevInvites.filter(
                        (invite) => invite.id !== selectedInviteId
                    )
                )
                addAlert({
                    id: 'invite-deleted',
                    severity: 'success',
                    message: 'Invite removed successfully',
                    timeout: 5,
                    handleDismiss: null,
                })
            } else {
                addAlert({
                    id: 'invite-delete-failed',
                    severity: 'error',
                    message: 'Failed to remove invite',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        } catch (error) {
            addAlert({
                id: 'invite-delete-error',
                severity: 'error',
                message: 'An error occurred while removing the invite',
                timeout: 5,
                handleDismiss: null,
            })
        } finally {
            setOpenInviteDialog(false)
            setSelectedInviteId(null)
        }
    }

    const openDeleteDialog = (id: number) => {
        setSelectedUserId(id)
        setOpenDialog(true)
    }

    const openInviteDeleteDialog = (id: number) => {
        setSelectedInviteId(id)
        setOpenInviteDialog(true)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Pending Invites</h2>
                <Button
                    onClick={() => navigate('/secure/users-invite')}
                    className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                >
                    Invite New User
                </Button>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingInvites.map((invite, index) => (
                            <tr key={`invite-${index}`}>
                                <td className="py-2 px-4 border-b">
                                    {invite.email}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <Button
                                        onClick={() =>
                                            openInviteDeleteDialog(invite.id!)
                                        }
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-2">Active Users</h2>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">
                                Is Tenant Admin
                            </th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border-b">
                                    {user.fullName}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {user.email}
                                </td>
                                <td className="text-center">
                                    {user.isTenantAdmin ? 'Yes' : 'No'}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <Button
                                        onClick={() =>
                                            navigate(
                                                `/secure/edit-user/${user.id}`
                                            )
                                        }
                                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </Button>
                                    {!user.isTenantAdmin && (
                                        <Button
                                            onClick={() =>
                                                openDeleteDialog(user.id!)
                                            }
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog open={openDialog} handler={setOpenDialog}>
                <DialogHeader>Confirm Delete</DialogHeader>
                <DialogBody>
                    <p>Are you sure you want to remove this user?</p>
                    <p>
                        Once removed, this email account can create its own
                        tenant. Users can only belong to one tenant at a time
                        and will lose the ability to be reinvited to this
                        tenant.
                    </p>
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
                        onClick={handleDeleteUser}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog open={openInviteDialog} handler={setOpenInviteDialog}>
                <DialogHeader>Confirm Delete</DialogHeader>
                <DialogBody>
                    Are you sure you want to remove this invite?
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setOpenInviteDialog(false)}
                        className="mr-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={handleDeleteInvite}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    )
}

export default AdminUsers
