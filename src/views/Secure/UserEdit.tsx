import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { Button } from '@material-tailwind/react'
import { SimpleUserGroupDTO, UserGroupDTO } from '../../DTOs/UserGroupDTO'
import { UserUserDTO } from '../../DTOs/UserDTO'

const UserEdit = () => {
    const { userId } = useParams<{ userId: string }>()
    const { token, user } = useContext(AuthContext)
    const { handleSubmit, control, setValue } = useForm<UserUserDTO>({
        defaultValues: {
            userId: Number(userId),
            groups: [],
            groupIds: [],
        },
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'groups',
    })
    const [availableGroups, setAvailableGroups] = useState<
        SimpleUserGroupDTO[]
    >([])
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
    const navigate = useNavigate()

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
                    const groups: SimpleUserGroupDTO[] = response.data.map(
                        (group: UserGroupDTO) => ({
                            groupId: group.id,
                            groupName: group.groupName,
                            tenantId: group.tenantId,
                        })
                    )
                    setAvailableGroups(groups)
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

        const fetchUserGroups = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/users/${userId}/groups`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setValue(
                        'groups',
                        response.data.map((group: UserGroupDTO) => {
                            return {
                                groupId: group.id,
                                groupName: group.groupName,
                                tenantId: group.tenantId,
                            }
                        })
                    )
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

        fetchAvailableGroups()
        fetchUserGroups()
    }, [token, user?.tenantId, userId, setValue])

    const onSubmit = async (data: UserUserDTO) => {
        try {
            const payload: UserUserDTO = {
                userId: data.userId,
                groupIds: data.groups
                    ? data.groups.map((group) => group.groupId!)
                    : [],
            }
            const response = await axios.put(
                `${import.meta.env.VITE_BackendURL}/users/${userId}/groups`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 200) {
                console.log('User groups updated successfully')
                navigate('/secure/users')
            } else {
                console.error(
                    'Failed to update user groups:',
                    response.statusText
                )
            }
        } catch (error) {
            console.error('Error updating user groups:', error)
        }
    }

    const addUserGroup = () => {
        if (selectedGroupId) {
            const selectedGroup = availableGroups.find(
                (group) => group.groupId === selectedGroupId
            )

            const isAlreadyAdded = fields.some(
                (field) => field.groupId === selectedGroup?.groupId
            )
            if (!isAlreadyAdded) {
                append(selectedGroup!)
            } else {
                alert('This group has already been added.')
            }
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit User Groups</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    <table>
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">
                                    User Group
                                </th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.id}>
                                    <td className="py-2 px-4 border-b">
                                        {field.groupName}
                                    </td>
                                    <td className="py-2 px-4 border-b">
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
                    Update User Groups
                </Button>
            </form>
        </div>
    )
}

export default UserEdit
