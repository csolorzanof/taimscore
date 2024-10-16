import { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { Button } from '@material-tailwind/react'
import { RegisterUserDTO } from '../../DTOs/RegisterUserDTO'
import { Country } from '../../types/Country'
import { AlertsContext } from '../../components/alerts/Alerts-Context'
import { Spinner } from '@material-tailwind/react'

const apiBaseURL = import.meta.env.VITE_BackendURL

const AdminTenantInformation = () => {
    const { token, user } = useContext(AuthContext)
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<RegisterUserDTO>()
    const [countries, setCountries] = useState<Country[]>([])
    const { addAlert } = useContext(AlertsContext)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true)
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/users/${user?.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    const userInfo: RegisterUserDTO = response.data
                    reset(userInfo)
                } else {
                    console.error(
                        'Failed to fetch user info:',
                        response.statusText
                    )
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.error('Error fetching user info:', error)
            }
        }

        fetchUserInfo()
    }, [token, user, setValue])

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/Countries`)
                setCountries(response.data)
            } catch (error) {
                console.error('Error fetching countries:', error)
            }
        }
        fetchCountries()
    }, [])

    const onSubmit = async (data: RegisterUserDTO) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BackendURL}/users/${user?.userId}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 200) {
                console.log('User information updated successfully')
                addAlert({
                    id: 'update-success',
                    severity: 'success',
                    message: 'Tenant information updated successfully',
                    timeout: 5,
                    handleDismiss: null,
                })
            } else {
                console.error(
                    'Failed to update user information:',
                    response.statusText
                )
            }
        } catch (error) {
            console.error('Error updating user information:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner color="blue" />
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Update User Information</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
            >
                <div className="flex flex-row w-full gap-2">
                    <div className="flex flex-col flex-1">
                        <label>
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50 bg-gray-400"
                            {...register('email', { required: true })}
                            readOnly={true}
                        />
                        {errors.email && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col flex-1">
                        <label>
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('companyName', { required: true })}
                        />
                        {errors.companyName && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-col flex-1">
                        <label>
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('name', { required: true })}
                        />
                        {errors.name && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col flex-1">
                        <label>
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('familyName', { required: true })}
                        />
                        {errors.familyName && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-row w-full gap-2">
                    <div className="flex flex-col flex-1">
                        <label>
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('phone', { required: true })}
                        />
                        {errors.phone && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col flex-1">
                        <label>
                            Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('jobTitle', { required: true })}
                        />
                        {errors.jobTitle && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-row w-full gap-2">
                    <div className="flex flex-col flex-1">
                        <label>Address 1</label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('address1')}
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label>Address 2</label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('address2')}
                        />
                    </div>
                </div>
                <div className="flex flex-row w-full gap-2">
                    <div className="flex flex-col flex-1">
                        <label>City</label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('city')}
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label>State/Province</label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('stateProvince')}
                        />
                    </div>
                </div>
                <div className="flex flex-row w-full gap-2">
                    <div className="flex flex-col flex-1">
                        <label>Zip</label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('zipCode')}
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label>
                            Country <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('countryId', { required: true })}
                        >
                            <option value="">Select...</option>
                            {countries.map((country) => (
                                <option
                                    key={country.shortCode}
                                    value={country.id}
                                >
                                    {country.countryName}
                                </option>
                            ))}
                        </select>
                        {errors.countryId && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex space-x-2">
                    <label>Include in Raffle</label>
                    <input type="checkbox" {...register('includeInRaffle')} />
                </div>
                <Button
                    type="submit"
                    variant="gradient"
                    color="green"
                    className="w-48"
                >
                    Update Information
                </Button>
            </form>
        </div>
    )
}

export default AdminTenantInformation
