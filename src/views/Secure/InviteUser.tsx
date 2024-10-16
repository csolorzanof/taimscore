import { useState, useEffect, useContext } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { AlertsContext } from '../../components/alerts/Alerts-Context'
import { Button, Input } from '@material-tailwind/react'
import { SimpleUserGroupDTO, UserGroupDTO } from '../../DTOs/UserGroupDTO'
import { InviteDTO } from '../../DTOs/InviteDTO'
import { useNavigate } from 'react-router-dom'

const InviteUser = () => {
    const { token, user } = useContext(AuthContext)
    const { addAlert } = useContext(AlertsContext)
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<InviteDTO>({
        defaultValues: {
            tenantId: user?.tenantId || 0,
            email: '',
            createdUserId: user?.userId || 0,
            groupIds: [],
            groups: [],
        },
    })

    const navigate = useNavigate()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'groups',
    })
    const [availableGroups, setAvailableGroups] = useState<
        SimpleUserGroupDTO[]
    >([])
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

    useEffect(() => {
        const fetchAvailableGroups = async () => {
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
                    setAvailableGroups(
                        response.data.map((group: UserGroupDTO) => ({
                            groupId: group.id,
                            tenantId: group.tenantId,
                            groupName: group.groupName,
                        }))
                    )
                } else {
                    console.error(
                        'Failed to fetch available groups:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching available groups:', error)
            }
        }

        fetchAvailableGroups()
    }, [token, user?.tenantId])

    const onSubmit = async (data: InviteDTO) => {
        if (data.groups.length === 0) {
            addAlert({
                id: 'invite-user-fail',
                severity: 'error',
                message: 'You must add at least one user group.',
                timeout: 5,
                handleDismiss: null,
            })
            return
        }

        data.groupIds = data.groups.map((group) => group.groupId!)

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BackendURL}/tenants/${
                    user?.tenantId
                }/invite`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 200) {
                addAlert({
                    id: 'invite-user-success',
                    severity: 'success',
                    message: 'Invite sent successfully',
                    timeout: 5,
                    handleDismiss: null,
                })
                navigate('/secure/users')
            } else {
                addAlert({
                    id: 'invite-user-fail',
                    severity: 'error',
                    message: 'Failed to send invite',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        } catch (error) {
            addAlert({
                id: 'invite-user-fail',
                severity: 'error',
                message: 'Failed to send invite',
                timeout: 5,
                handleDismiss: null,
            })
        }
    }

    const addUserGroup = () => {
        if (selectedGroupId) {
            const selectedGroup = availableGroups.find(
                (group) => group.groupId === selectedGroupId
            )
            if (selectedGroup) {
                const isAlreadyAdded = fields.some(
                    (field) => field.groupId === selectedGroupId
                )
                if (!isAlreadyAdded) {
                    append({ ...selectedGroup })
                } else {
                    addAlert({
                        id: 'invite-user-fail',
                        severity: 'warning',
                        message: 'This group has already been added',
                        timeout: 5,
                        handleDismiss: null,
                    })
                }
            }
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Invite New User</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <Input
                        type="email"
                        {...register('email', { required: true })}
                        className="mt-1 block w-full"
                        crossOrigin=""
                    />
                    {errors.email && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">User Groups</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Available User Groups
                        </label>
                        <select
                            value={selectedGroupId || ''}
                            onChange={(e) => {
                                console.log(e.target.value)
                                setSelectedGroupId(Number(e.target.value))
                            }}
                            className="mt-1 block w-full"
                        >
                            <option value="" disabled>
                                Select a user group
                            </option>
                            {availableGroups.map((group) => (
                                <option
                                    key={group.groupId}
                                    value={group.groupId}
                                >
                                    {group.groupName}
                                </option>
                            ))}
                        </select>
                        <Button
                            type="button"
                            color="blue"
                            onClick={addUserGroup}
                            className="mt-2"
                        >
                            Add User Group
                        </Button>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th>User Group</th>
                                <th className="w-28">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.groupId}>
                                    <td>{field.groupName}</td>
                                    <td>
                                        <Button
                                            type="button"
                                            color="red"
                                            onClick={() => remove(index)}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Button type="submit" variant="gradient" color="green">
                    Send Invite
                </Button>
            </form>
        </div>
    )
}

export default InviteUser
