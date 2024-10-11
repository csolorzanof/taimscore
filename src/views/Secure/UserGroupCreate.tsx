import { useState, useEffect, useContext } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { Button, Select, Option, Input } from '@material-tailwind/react'

import {
    UserGroupDTO,
    UserGroupAssessmentProfileDTO,
    SimpleAssessmentProfileDTO,
} from '../../DTOs/UserGroupDTO' // Adjust the path as necessary

const UserGroupCreate = () => {
    const { token, user } = useContext(AuthContext)
    const {
        register,
        handleSubmit,
        control,
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

        fetchAvailableProfiles()
    }, [token, user?.tenantId])

    const onSubmit = async (data: UserGroupDTO) => {
        if (data.assessmentProfiles.length === 0) {
            alert('You must add at least one assessment profile.')
            return
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BackendURL}/usergroups`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 200) {
                console.log('User group created successfully')
            } else {
                console.error(
                    'Failed to create user group:',
                    response.statusText
                )
            }
        } catch (error) {
            console.error('Error creating user group:', error)
        }
    }

    const addAssessmentProfile = () => {
        if (selectedProfileId) {
            const selectedProfile = availableProfiles.find(
                (profile) => profile.id === selectedProfileId
            )
            if (selectedProfile) {
                append({
                    assessmentProfileId: selectedProfile.id,
                    assessmentProfileName: selectedProfile.profileName,
                    createdUserId: user?.userId || 0,
                    createdDate: new Date(),
                })
            }
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New User Group</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Group Name
                    </label>
                    <Input
                        type="text"
                        {...register('groupName', { required: true })}
                        className="mt-1 block w-full"
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
                    {fields.map((field, index) => (
                        <div key={field.id} className="mb-4 border p-4 rounded">
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Assessment Profile ID
                                </label>
                                <Controller
                                    name={`assessmentProfiles.${index}.assessmentProfileId`}
                                    control={control}
                                    defaultValue={field.assessmentProfileId}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            {...field}
                                            className="mt-1 block w-full"
                                            readOnly
                                        />
                                    )}
                                />
                                {errors.assessmentProfiles?.[index]
                                    ?.assessmentProfileId && (
                                    <span className="text-red-500">
                                        This field is required
                                    </span>
                                )}
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Assessment Profile Name
                                </label>
                                <Controller
                                    name={`assessmentProfiles.${index}.assessmentProfileName`}
                                    control={control}
                                    defaultValue={field.assessmentProfileName}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            {...field}
                                            className="mt-1 block w-full"
                                            readOnly
                                        />
                                    )}
                                />
                                {errors.assessmentProfiles?.[index]
                                    ?.assessmentProfileName && (
                                    <span className="text-red-500">
                                        This field is required
                                    </span>
                                )}
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Created User ID
                                </label>
                                <Controller
                                    name={`assessmentProfiles.${index}.createdUserId`}
                                    control={control}
                                    defaultValue={field.createdUserId}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            {...field}
                                            className="mt-1 block w-full"
                                            readOnly
                                        />
                                    )}
                                />
                                {errors.assessmentProfiles?.[index]
                                    ?.createdUserId && (
                                    <span className="text-red-500">
                                        This field is required
                                    </span>
                                )}
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Created Date
                                </label>
                                <Controller
                                    name={`assessmentProfiles.${index}.createdDate`}
                                    control={control}
                                    defaultValue={field.createdDate}
                                    render={({ field }) => (
                                        <Input
                                            type="date"
                                            {...field}
                                            className="mt-1 block w-full"
                                            readOnly
                                        />
                                    )}
                                />
                                {errors.assessmentProfiles?.[index]
                                    ?.createdDate && (
                                    <span className="text-red-500">
                                        This field is required
                                    </span>
                                )}
                            </div>
                            <Button
                                type="button"
                                color="red"
                                onClick={() => remove(index)}
                                className="mt-2"
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="submit" variant="gradient" color="green">
                    Create User Group
                </Button>
            </form>
        </div>
    )
}

export default UserGroupCreate
