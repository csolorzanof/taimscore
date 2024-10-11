import { useState, useEffect, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { Button, Input } from '@material-tailwind/react'
import {
    AssessmentProfileDTO,
    ProcessOwnerDTO,
} from '../../DTOs/AssessmentProfileDTO'
import { OrganizationSizeDTO } from '../../DTOs/OrganizationSizeDTO'
import {
    AssessmentStandardControlGroupDTO,
    AssessmentStandardDTO,
} from '../../DTOs/AssessmentStandardDTO'
import { IndustryGroupDTO } from '../../DTOs/IndustryGroupDTO'
import { RevenueLevelDTO } from '../../DTOs/RevenueLevelDTO'
import { CountryDTO } from '../../DTOs/CountryDTO'
import { AlertsContext } from '../../components/alerts/Alerts-Context'
import { useNavigate } from 'react-router-dom'

const AssessmentProfileNew = () => {
    const { token, user } = useContext(AuthContext)
    const { addAlert } = useContext(AlertsContext)
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        setValue,
    } = useForm<AssessmentProfileDTO>()
    const navigate = useNavigate()
    const [processOwners, setProcessOwners] = useState<ProcessOwnerDTO[]>([])
    const assessmentStandard = watch('assessmentStandardId')
    const [organizationSizes, setOrganizationSizes] = useState<
        OrganizationSizeDTO[]
    >([])
    const [assessmentStandards, setAssessmentStandards] = useState<
        AssessmentStandardDTO[]
    >([])
    const [assessmentControlGroups, setAssessmentControlGroups] = useState<
        AssessmentStandardControlGroupDTO[]
    >([])

    const [processOwnerName, setProcessOwnerName] = useState('')
    const [processOwnerEmail, setProcessOwnerEmail] = useState('')
    const [processOwnerTelephone, setProcessOwnerTelephone] = useState('')
    const [industryGroups, setIndustryGroups] = useState<IndustryGroupDTO[]>([])
    const [reveneuLevels, setReveneuLevels] = useState<RevenueLevelDTO[]>([])
    const [countries, setCountries] = useState<CountryDTO[]>([])

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/countries`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setCountries(response.data)
                } else {
                    console.error(
                        'Failed to fetch countries:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching countries:', error)
            }
        }

        const fetchIndustryGroups = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/industrygroups`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setIndustryGroups(response.data)
                } else {
                    console.error(
                        'Failed to fetch industry groups:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching industry groups:', error)
            }
        }

        const fetchRevenueLevels = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/revenuelevels`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setReveneuLevels(response.data)
                } else {
                    console.error(
                        'Failed to fetch revenue levels:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching revenue levels:', error)
            }
        }

        const fetchOrganizationSizes = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/organizationsizes`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setOrganizationSizes(response.data)
                } else {
                    console.error(
                        'Failed to fetch organization sizes:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching organization sizes:', error)
            }
        }

        const fetchAssessmentStandards = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/tenants/${
                        user?.tenantId
                    }/assessmentstandards`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setAssessmentStandards(response.data)
                } else {
                    console.error(
                        'Failed to fetch assessment standards:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching assessment standards:', error)
            }
        }

        if (assessmentStandard) {
            const fetchProcessOwners = async () => {
                try {
                    const response = await axios.get(
                        `${
                            import.meta.env.VITE_BackendURL
                        }/assessmentstandards/${assessmentStandard}/controlgroups`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                    if (response.status === 200) {
                        setAssessmentControlGroups(response.data)
                        const procOwners: ProcessOwnerDTO[] = response.data.map(
                            (r: AssessmentStandardControlGroupDTO) => {
                                return {
                                    standardControlGroupId: r.id,
                                    standardControlGroupName: r.groupId,
                                    standardControlGroupObjective:
                                        r.groupObjective,
                                    name: '',
                                    emailAddress: '',
                                    telephoneNumber: '',
                                }
                            }
                        )
                        setProcessOwners(procOwners)
                    } else {
                        console.error(
                            'Failed to fetch process owners:',
                            response.statusText
                        )
                    }
                } catch (error) {
                    console.error('Error fetching process owners:', error)
                }
            }

            fetchProcessOwners()
        }

        fetchOrganizationSizes()
        fetchAssessmentStandards()
        fetchIndustryGroups()
        fetchRevenueLevels()
        fetchCountries()
    }, [assessmentStandard, token])

    useEffect(() => {
        processOwners.forEach((_, index) => {
            register(`assessmentProfileProcessOwners.${index}.ownerName`, {
                required: true,
            })
            register(`assessmentProfileProcessOwners.${index}.ownerEmail`, {
                required: true,
            })
            register(`assessmentProfileProcessOwners.${index}.ownerTelephone`, {
                required: true,
            })
        })
    }, [processOwners])

    const onSubmit = async (data: AssessmentProfileDTO) => {
        try {
            data.createdUserId = user?.userId as number
            data.tenantId = user?.tenantId as number
            data.createdDate = new Date()
            const response = await axios.post(
                `${import.meta.env.VITE_BackendURL}/assessmentprofiles`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 200) {
                console.log('Assessment profile created successfully')
                addAlert({
                    id: 'profile-created',
                    message: 'Assessment profile created successfully',
                    severity: 'success',
                    timeout: 5,
                    handleDismiss: null,
                })
                navigate('/secure/assessment-profile')
            } else {
                console.error(
                    'Failed to create assessment profile:',
                    response.statusText
                )
            }
        } catch (error) {
            console.error('Error creating assessment profile:', error)
        }
    }

    const applyToAll = () => {
        processOwners.forEach((_, index) => {
            setValue(
                `assessmentProfileProcessOwners.${index}.ownerName`,
                processOwnerName
            )
            setValue(
                `assessmentProfileProcessOwners.${index}.ownerEmail`,
                processOwnerEmail
            )
            setValue(
                `assessmentProfileProcessOwners.${index}.ownerTelephone`,
                processOwnerTelephone
            )
        })
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Create New Assessment Profile
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full flex flex-row gap-4">
                    <div className="w-80 mb-4">
                        <Input
                            type="text"
                            label="Profile Name"
                            {...register('profileName', { required: true })}
                            className="mt-1 block"
                        />
                        {errors.profileName && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                    <div className="mb-4">
                        <Controller
                            name="orgSizeId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="mt-1 block w-full rounded-md"
                                >
                                    <option value="0">
                                        Select Organization Size
                                    </option>
                                    {organizationSizes.map((size) => (
                                        <option
                                            key={`org-${size.id}`}
                                            value={size.id}
                                        >
                                            {size.orgSize}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.orgSizeId && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                </div>
                <div className="w-full flex flex-row gap-4">
                    <div className="mb-4">
                        <Controller
                            name="industryGroupId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="mt-1 block w-full rounded-md"
                                >
                                    <option value="0">
                                        Select Industry Group
                                    </option>
                                    {industryGroups.map((industry) => (
                                        <option
                                            key={`ind-${industry.id}`}
                                            value={industry.id}
                                        >
                                            {industry.industryName}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.industryGroupId && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                    <div className="mb-4">
                        <Controller
                            name="revLevelId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="mt-1 block w-full rounded-md"
                                >
                                    <option value="0">
                                        Select Industry Revenue Level
                                    </option>
                                    {reveneuLevels.map((revLevel) => (
                                        <option
                                            key={`ind-${revLevel.id}`}
                                            value={revLevel.id}
                                        >
                                            {revLevel.revLevel}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.revLevelId && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                </div>
                <div className="w-full flex flex-row gap-4">
                    <div className="mb-4">
                        <Controller
                            name="countryId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="mt-1 block w-full rounded-md"
                                >
                                    <option value="0">
                                        Select Country / Region
                                    </option>
                                    {countries.map((country) => (
                                        <option
                                            key={`country-${country.id}`}
                                            value={country.id}
                                        >
                                            {country.countryName}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.countryId && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                    <div className="mb-4">
                        <Controller
                            name="assessmentStandardId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="mt-1 block w-full rounded-md"
                                >
                                    <option value="0">
                                        Select Assessment Standard
                                    </option>
                                    {assessmentStandards.map((standard) => (
                                        <option
                                            key={standard.id}
                                            value={standard.id?.toString()}
                                        >
                                            {standard.standardName} -{' '}
                                            {standard.standardVersion}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.assessmentStandardId && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                </div>

                {processOwners.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-xl font-bold mb-2">
                            Process Owners
                        </h2>
                        <div className="flex flex-row gap-2 border-b border-black pb-4">
                            <Input
                                type="text"
                                label="Name"
                                value={processOwnerName}
                                onChange={(e: any) =>
                                    setProcessOwnerName(e.target.value)
                                }
                                className="mt-1 block w-full"
                            />
                            <Input
                                type="email"
                                label="Email Address"
                                value={processOwnerEmail}
                                onChange={(e: any) =>
                                    setProcessOwnerEmail(e.target.value)
                                }
                                className="mt-1 block w-full"
                            />
                            <Input
                                type="tel"
                                label="Telephone Number"
                                value={processOwnerTelephone}
                                onChange={(e: any) =>
                                    setProcessOwnerTelephone(e.target.value)
                                }
                                className="mt-1 block w-full"
                            />
                            <Button
                                onClick={applyToAll}
                                className="w-80 bg-blue-500 text-white px-2 py-1 rounded ml-2"
                            >
                                Apply to All
                            </Button>
                        </div>
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">
                                        Control Group
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Control Group Objective
                                    </th>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">
                                        Email Address
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Telephone Number
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {processOwners.map((owner, index) => (
                                    <tr
                                        key={owner.standardControlGroupId}
                                        className="border-b-black border-b"
                                    >
                                        <td className="text-sm p-1">
                                            <input
                                                type="hidden"
                                                {...register(
                                                    `assessmentProfileProcessOwners.${index}.standardControlGroupId`
                                                )}
                                                value={
                                                    owner.standardControlGroupId
                                                }
                                            />
                                            {owner.standardControlGroupName}
                                        </td>
                                        <td className="text-xs p-1">
                                            {
                                                owner.standardControlGroupObjective
                                            }
                                        </td>
                                        <td>
                                            <Input
                                                type="text"
                                                {...register(
                                                    `assessmentProfileProcessOwners.${index}.ownerName`,
                                                    { required: true }
                                                )}
                                                defaultValue={owner.ownerName}
                                                className="mt-1 block w-full"
                                            />
                                            {errors
                                                .assessmentProfileProcessOwners?.[
                                                index
                                            ]?.ownerName && (
                                                <span className="text-red-500">
                                                    This field is required
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <Input
                                                type="text"
                                                {...register(
                                                    `assessmentProfileProcessOwners.${index}.ownerEmail`,
                                                    { required: true }
                                                )}
                                                defaultValue={owner.ownerEmail}
                                                className="mt-1 block w-full"
                                            />
                                            {errors
                                                .assessmentProfileProcessOwners?.[
                                                index
                                            ]?.ownerEmail && (
                                                <span className="text-red-500">
                                                    This field is required
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <Input
                                                type="text"
                                                {...register(
                                                    `assessmentProfileProcessOwners.${index}.ownerTelephone`,
                                                    { required: true }
                                                )}
                                                defaultValue={
                                                    owner.ownerTelephone
                                                }
                                                className="mt-1 block w-full"
                                            />
                                            {errors
                                                .assessmentProfileProcessOwners?.[
                                                index
                                            ]?.ownerTelephone && (
                                                <span className="text-red-500">
                                                    This field is required
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Button type="submit" variant="gradient" color="green">
                    Create Assessment Profile
                </Button>
            </form>
        </div>
    )
}

export default AssessmentProfileNew
