import { useState, useEffect, useContext } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { Button, Input } from '@material-tailwind/react'
import { AlertsContext } from '../../components/alerts/Alerts-Context'

import {
    UserGroupDTO,
    SimpleAssessmentProfileDTO,
} from '../../DTOs/UserGroupDTO' // Adjust the path as necessary

const UserGroupEdit = () => {
    const { id } = useParams<{ id: string }>()
    const { token, user } = useContext(AuthContext)
    const { addAlert } = useContext(AlertsContext)
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<UserGroupDTO>({
        defaultValues: {
            tenantId: user?.tenantId || 0,
            groupName: '',
            createdUserId: user?.userId || 0,
            createdDate: new Date(),
            assessmentProfiles: [],
        },
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'assessmentProfiles',
    })
    const [availableProfiles, setAvailableProfiles] = useState<
        SimpleAssessmentProfileDTO[]
    >([])
    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
        null
    )

    useEffect(() => {
        const fetchAvailableProfiles = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/tenants/${
                        user?.tenantId
                    }/simpleassessmentprofiles`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setAvailableProfiles(response.data)
                } else {
                    console.error(
                        'Failed to fetch available profiles:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching available profiles:', error)
            }
        }

        const fetchUserGroup = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/usergroups/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    const userGroup = response.data
                    reset(userGroup)
                    /*setValue('groupName', userGroup.groupName)
                    setValue('createdUserId', userGroup.createdUserId)
                    setValue('createdDate', new Date(userGroup.createdDate))
                    userGroup.assessmentProfiles.forEach(
                        (profile: UserGroupAssessmentProfileDTO) => {
                            append(profile)
                        }
                    )*/
                } else {
                    console.error(
                        'Failed to fetch user group:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching user group:', error)
            }
        }

        fetchAvailableProfiles()
        fetchUserGroup()
    }, [token, user?.tenantId, id, setValue, append])

    const onSubmit = async (data: UserGroupDTO) => {
        if (data.assessmentProfiles.length === 0) {
            alert('You must add at least one assessment profile.')
            return
        }

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BackendURL}/usergroups/${id}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 200) {
                console.log('User group updated successfully')
                addAlert({
                    id: 'user-group-updated',
                    severity: 'success',
                    message: 'User group updated successfully',
                    timeout: 5,
                    handleDismiss: null,
                })
                navigate('/secure/user-groups')
            } else {
                console.error(
                    'Failed to update user group:',
                    response.statusText
                )
                addAlert({
                    id: 'user-group-update-failed',
                    severity: 'error',
                    message: 'Failed to update user group',
                    timeout: 5,
                    handleDismiss: null,
                })
            }
        } catch (error) {
            console.error('Error updating user group:', error)
            addAlert({
                id: 'user-group-update-failed',
                severity: 'error',
                message: 'Failed to update user group',
                timeout: 5,
                handleDismiss: null,
            })
        }
    }

    const addAssessmentProfile = () => {
        if (selectedProfileId) {
            const selectedProfile = availableProfiles.find(
                (profile) => profile.id === selectedProfileId
            )
            if (selectedProfile) {
                const isAlreadyAdded = fields.some(
                    (field) => field.assessmentProfileId === selectedProfile.id
                )
                if (!isAlreadyAdded) {
                    append({
                        assessmentProfileId: selectedProfile.id,
                        assessmentProfileName: selectedProfile.profileName,
                        createdUserId: user?.userId || 0,
                        createdDate: new Date(),
                    })
                } else {
                    addAlert({
                        id: 'assessment-profile-already-added',
                        severity: 'warning',
                        message: 'This profile has already been added.',
                        timeout: 2,
                        handleDismiss: null,
                    })
                }
            }
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit User Group</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Group Name
                    </label>
                    <Input
                        type="text"
                        {...register('groupName', { required: true })}
                        className="mt-1 block w-full"
                        crossOrigin="green"
                    />
                    {errors.groupName && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">
                        Assessment Profiles
                    </h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Available Assessment Profiles
                        </label>
                        <select
                            value={selectedProfileId || ''}
                            onChange={(e) =>
                                setSelectedProfileId(Number(e.target.value))
                            }
                            className="mt-1 block w-full"
                        >
                            <option value="" disabled>
                                Select an assessment profile
                            </option>
                            {availableProfiles.map((profile) => (
                                <option key={profile.id} value={profile.id}>
                                    {profile.profileName}
                                </option>
                            ))}
                        </select>
                        <Button
                            type="button"
                            color="blue"
                            onClick={addAssessmentProfile}
                            className="mt-2"
                        >
                            Add Assessment Profile
                        </Button>
                    </div>
                    <div>
                        <table className="w-full">
                            <thead>
                                <tr className="border-black border-b-2">
                                    <th>Assessment Profile Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((field, index) => (
                                    <tr key={field.id}>
                                        <td>{field.assessmentProfileName}</td>
                                        <td className="w-24">
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
                </div>
                <Button type="submit" variant="gradient" color="green">
                    Update User Group
                </Button>
            </form>
        </div>
    )
}

export default UserGroupEdit
