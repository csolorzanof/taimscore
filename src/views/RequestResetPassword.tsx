import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AlertsContext } from '../components/alerts/Alerts-Context'

const apiBaseURL = import.meta.env.VITE_BackendURL

const RequestResetPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const navigate = useNavigate()
    const { addAlert } = useContext(AlertsContext)

    const onSubmit = async (data: any) => {
        const requestResetPasswordData = {
            email: data.email,
        }

        try {
            const response = await axios.post(
                `${apiBaseURL}/RequestPasswordRecovery`,
                requestResetPasswordData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (response.status === 200) {
                console.log('Password reset request successful')
                // Handle successful password reset request (e.g., show a success message)
                addAlert({
                    id: 'reset-password-requested',
                    severity: 'success',
                    message:
                        'Password reset requested successfully, check your email for further instructions',
                    timeout: 5,
                    handleDismiss: null,
                })
                navigate('/')
            } else {
                console.error('Failed to request password reset')
                addAlert({
                    id: 'reset-password-failed',
                    severity: 'error',
                    message: 'Failed to request password reset',
                    timeout: 5,
                    handleDismiss: null,
                })
                // Handle other response statuses if needed
            }
        } catch (error) {
            console.error('Error requesting password reset:', error)
            addAlert({
                id: 'reset-password-failed',
                severity: 'error',
                message: 'Failed to request password reset',
                timeout: 5,
                handleDismiss: null,
            })
            // Handle error
        }
    }

    return (
        <div className="container flex flex-col items-center">
            <h1 className="text-center font-bold mt-4">
                Request Password Reset
            </h1>
            <form
                className="flex flex-col space-y-4 w-72 sm:w-128"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col">
                    <label>
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('email', { required: true })}
                    />
                    {errors.email && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                <div className="flex flex-row space-x-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded p-2"
                    >
                        Request Reset
                    </button>
                </div>
            </form>
        </div>
    )
}

export default RequestResetPassword
