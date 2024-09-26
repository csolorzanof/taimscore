import { useForm, FormProvider } from 'react-hook-form'
import { GoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../AuthProvider'
import { useContext, useState } from 'react'
import { LoginDTO } from '../DTOs/LoginDTO'
import { LoginResponseDTO } from '../DTOs/LoginResponseDTO'
import { VerifyTokenDTO } from '../DTOs/VerifyTokenDTO'
import { AlertsContext } from '../components/alerts/Alerts-Context'

const apiBaseURL = import.meta.env.VITE_BackendURL

const LandingPage = () => {
    const methods = useForm()
    const register = methods.register
    const { setToken, setUser, setLoginResponse } = useContext(AuthContext)
    const { addAlert } = useContext(AlertsContext)
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)

    const onSubmit = methods.handleSubmit(async (data) => {
        const loginDTO: LoginDTO = {
            userName: data.email,
            password: data.password,
        }

        try {
            const response = await axios.post(`${apiBaseURL}/login`, loginDTO)
            const token = response.data.token
            const user = response.data.user
            setToken(token)
            setUser(user)
            navigate('/secure/landing')
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setError('Invalid credentials')
            } else {
                setError('An error occurred. Please try again later')
            }
        }
    })

    const googleSuccess = async (response: any) => {
        const clientId = response.clientId
        const credential = response.credential
        const verifyPayload: VerifyTokenDTO = {
            token: credential,
        }
        const verifyResponse = await axios.post(
            `${apiBaseURL}/verifyGoogleToken`,
            verifyPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        const loginResponse: LoginResponseDTO = verifyResponse.data
        if (loginResponse.redirectToRegister) {
            setLoginResponse(loginResponse)
            navigate('/register')
        } else {
            setToken(loginResponse.token)
            setUser({
                userId: loginResponse.userId,
                email: loginResponse.email,
                name: loginResponse.name,
                pictureUrl: loginResponse.pictureUrl,
                locale: loginResponse.locale,
                familyName: loginResponse.familyName,
                givenName: loginResponse.givenName,
                authProviderId: loginResponse.authProviderId,
            })
            navigate('/secure/landing')
        }
    }

    const googleFailure = () => {
        addAlert({
            id: 'google-sign-in-failed',
            severity: 'error',
            message: 'Google Sign In was unsuccessful. Try again later',
            timeout: 5,
            handleDismiss: null,
        })
    }

    return (
        <div className="container mx-auto flex flex-col items-center">
            <h1 className="text-3xl font-bold underline mt-10">TAIMSCORE</h1>

            <FormProvider {...methods}>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    noValidate
                    className="w-72 sm:w-96 mt-10"
                >
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="border border-gray-300 rounded p-2 w-50"
                            {...register('email', {
                                required: {
                                    value: true,
                                    message: 'Email is required',
                                },
                            })}
                        />

                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', {
                                required: {
                                    value: true,
                                    message: 'Password is required',
                                },
                            })}
                            className="border border-gray-300 rounded p-2 w-120"
                        />
                        <Link
                            to={'/request-reset-password'}
                            className="text-blue-500 font-bold"
                        >
                            Forgot password?
                        </Link>
                        <div className="flex flex-col space-y-4 items-center text-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white rounded p-2 w-60"
                                onClick={onSubmit}
                            >
                                Login
                            </button>
                            <GoogleLogin
                                onSuccess={googleSuccess}
                                onError={googleFailure}
                            />
                        </div>

                        <p className="text-center">
                            Don't have an account?{' '}
                            <Link
                                to={'/register'}
                                className="text-blue-500 font-bold"
                            >
                                Sign up for free
                            </Link>
                        </p>
                        {error && (
                            <p className="text-red-500 text-center">{error}</p>
                        )}
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default LandingPage
