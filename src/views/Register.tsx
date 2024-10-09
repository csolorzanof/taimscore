import { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Country } from '../types/Country'
import { SecurityQuestion } from '../types/SecurityQuestion'
import { RegisterUserDTO } from '../DTOs/RegisterUserDTO'
import { AuthContext } from '../AuthProvider'
import { LoggedInUser } from '../types/LoggedInUser'
import { useNavigate } from 'react-router-dom'
import { AlertsContext } from '../components/alerts/Alerts-Context'

const apiBaseURL = import.meta.env.VITE_BackendURL
type FormValues = {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
    companyName: string
    phone: string
    jobTitle: string
    address1: string
    address2: string
    city: string
    state: string
    zip: string
    country: number
    securityQuestion: number
    answer: string
    includeInRaffle: boolean
}

const defaultValues: FormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    jobTitle: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 0,
    securityQuestion: 0,
    answer: '',
    includeInRaffle: false,
}

const Register = () => {
    const [countries, setCountries] = useState<Country[]>([])
    const [securityQuestions, setSecurityQuestions] = useState<
        SecurityQuestion[]
    >([])

    const { setToken, setUser, loginResponse } = useContext(AuthContext)
    const navigate = useNavigate()
    const { addAlert } = useContext(AlertsContext)

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset,
    } = useForm<FormValues>({ defaultValues })

    const regularRegistration = async (data: any) => {
        try {
            const registerUserDTO: RegisterUserDTO = {
                email: data.email,
                name: data.firstName,
                familyName: data.lastName,
                password: data.password,
                companyName: data.companyName,
                phone: data.phone,
                jobTitle: data.jobTitle,
                address1: data.address1,
                address2: data.address2,
                city: data.city,
                stateProvince: data.state,
                zipCode: data.zip,
                countryId: data.country,
                securityQuestionId: data.securityQuestion,
                answer: data.answer,
                includeInRaffle: data.includeInRaffle,
                isActive: true,
                tenantId: 0,
                authProviderId: 1,
                locale: 'en-US',
                givenName: `${data.firstName} ${data.lastName}`,
                requiresSecQuestion: true,
                createdDate: new Date(),
            }
            const response = await axios.post(
                `${apiBaseURL}/register`,
                registerUserDTO,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            var loggedInUser: LoggedInUser = {
                userId: response.data.userId,
                email: response.data.email,
                name: response.data.name,
                pictureUrl: response.data.pictureUrl,
                locale: response.data.locale,
                familyName: response.data.familyName,
                givenName: response.data.givenName,
                authProviderId: response.data.authProviderId,
                tenantId: response.data.tenantId,
            }
            setToken(response.data.token)
            setUser(loggedInUser)
            console.log('Success:', response.data)
            navigate('/secure')
        } catch (error) {
            console.error('Error:', error)
            addAlert({
                id: 'register-failed',
                severity: 'error',
                message: 'Failed to register',
                timeout: 5,
                handleDismiss: null,
            })
        }
    }

    const socialRegistration = async (data: any) => {
        try {
            const registerUserDTO: RegisterUserDTO = {
                email: data.email,
                name: data.firstName,
                familyName: data.lastName,
                password: '',
                companyName: data.companyName,
                phone: data.phone,
                jobTitle: data.jobTitle,
                address1: data.address1,
                address2: data.address2,
                pictureUrl: loginResponse?.pictureUrl,
                city: data.city,
                stateProvince: data.state,
                zipCode: data.zip,
                countryId: data.country,
                securityQuestionId: data.securityQuestion,
                answer: data.answer,
                includeInRaffle: data.includeInRaffle,
                isActive: true,
                tenantId: 0,
                authProviderId: loginResponse
                    ? loginResponse.authProviderId
                    : 1,
                locale: loginResponse?.locale,
                givenName: `${data.firstName} ${data.lastName}`,
                requiresSecQuestion: false,
                createdDate: new Date(),
            }
            const response = await axios.post(
                `${apiBaseURL}/registerGoogle`,
                registerUserDTO,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            var loggedInUser: LoggedInUser = {
                userId: response.data.userId,
                email: response.data.email,
                name: response.data.name,
                pictureUrl: response.data.pictureUrl,
                locale: response.data.locale,
                familyName: response.data.familyName,
                givenName: response.data.givenName,
                authProviderId: response.data.authProviderId,
                tenantId: response.data.tenantId,
            }
            setToken(response.data.token)
            setUser(loggedInUser)
            console.log('Success:', response.data)
            navigate('/secure')
        } catch (error) {
            console.error('Error:', error)
            addAlert({
                id: 'register-failed',
                severity: 'error',
                message: 'Failed to register',
                timeout: 5,
                handleDismiss: null,
            })
        }
    }

    const onSubmit = async (data: any) => {
        if (loginResponse) {
            socialRegistration(data)
        } else {
            regularRegistration(data)
        }
    }

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/Countries`)
                setCountries(response.data)
            } catch (error) {
                console.error('Error fetching countries:', error)
            }
        }

        const fetchSecurityQuestions = async () => {
            try {
                const response = await axios.get(
                    `${apiBaseURL}/SecurityQuestions`
                )
                setSecurityQuestions(response.data)
            } catch (error) {
                console.error('Error fetching security questions:', error)
            }
        }

        fetchCountries()
        fetchSecurityQuestions()
        if (loginResponse) {
            reset({
                email: loginResponse.email,
                firstName: loginResponse.givenName,
                lastName: loginResponse.familyName,
            })
        }
    }, [])

    return (
        <div className="container flex flex-col items-center">
            <h1 className="text-center font-bold mt-4">Sign Up</h1>
            <form
                className="flex flex-col space-y-4 w-72 sm:w-128"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col">
                    <label>
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('email', { required: true })}
                    />
                    {errors.email && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                {!loginResponse && (
                    <div className="flex flex-col">
                        <label>
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('password', {
                                required: {
                                    value: true,
                                    message: 'This field is required',
                                },
                                pattern: {
                                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                                    message:
                                        'Password must be at least 8 charactes long, have one uppercase letter, have one lowercase letter, have at least one number and use at least one special character',
                                },
                            })}
                        />
                        {errors.password && (
                            <span className="text-red-500">
                                {errors.password.message?.toString()}
                            </span>
                        )}
                    </div>
                )}
                {!loginResponse && (
                    <div className="flex flex-col">
                        <label>
                            Confirm Password{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('confirmPassword', {
                                required: {
                                    value: true,
                                    message: 'This field is required',
                                },
                                validate: {
                                    equals: (v) =>
                                        getValues('password') === v ||
                                        'Password and confirmation are not equal',
                                },
                            })}
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-500">
                                {errors.confirmPassword.message?.toString()}
                            </span>
                        )}
                    </div>
                )}
                <div className="flex flex-col">
                    <label>
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('firstName', { required: true })}
                    />
                    {errors.firstName && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                <div className="flex flex-col">
                    <label>
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('lastName', { required: true })}
                    />
                    {errors.lastName && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                <div className="flex flex-col">
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
                <div className="flex flex-col">
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
                <div className="flex flex-col">
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
                <div className="flex flex-col">
                    <label>Address 1</label>
                    <input
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('address1')}
                    />
                </div>
                <div className="flex flex-col">
                    <label>Address 2</label>
                    <input
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('address2')}
                    />
                </div>
                <div className="flex flex-col">
                    <label>City</label>
                    <input
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('city')}
                    />
                </div>
                <div className="flex flex-col">
                    <label>State/Province</label>
                    <input
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('state')}
                    />
                </div>
                <div className="flex flex-col">
                    <label>Zip</label>
                    <input
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('zip')}
                    />
                </div>
                <div className="flex flex-col">
                    <label>
                        Country <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('country', { required: true })}
                    >
                        <option value="">Select...</option>
                        {countries.map((country) => (
                            <option key={country.shortCode} value={country.id}>
                                {country.countryName}
                            </option>
                        ))}
                    </select>
                    {errors.country && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                {!loginResponse && (
                    <div className="flex flex-col">
                        <label>
                            Security Question{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('securityQuestion', {
                                required: true,
                            })}
                        >
                            <option value="">Select...</option>
                            {securityQuestions.map((question, index) => (
                                <option key={index} value={question.id}>
                                    {question.questionText}
                                </option>
                            ))}
                        </select>
                        {errors.securityQuestion && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                )}
                {!loginResponse && (
                    <div className="flex flex-col">
                        <label>
                            Answer <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('answer', { required: true })}
                        />
                        {errors.answer && (
                            <span className="text-red-500">
                                This field is required
                            </span>
                        )}
                    </div>
                )}
                <div className="flex space-x-2">
                    <label>Include in Raffle</label>
                    <input type="checkbox" {...register('includeInRaffle')} />
                </div>
                <div className="flex space-x-4">
                    <button
                        className="bg-blue-500 text-white rounded p-2 w-60"
                        type="submit"
                    >
                        Sign Up
                    </button>
                    <button
                        className="bg-red-500 text-white rounded p-2 w-60"
                        type="button"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Register
