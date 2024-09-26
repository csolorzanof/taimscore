import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { VerifyTokenAndResetPasswordDTO } from '../DTOs/VerifyTokenAndResetPasswordDTO'
import { AlertsContext } from '../components/alerts/Alerts-Context'
import { useContext } from 'react'

const apiBaseURL = import.meta.env.VITE_BackendURL

const ResetPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm()

    const { addAlert } = useContext(AlertsContext)

    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search)
    const token = queryParams.get('token')

    const onSubmit = async (data: any) => {
        if (!token) {
            console.error('No token provided')
            return
        }

        const resetPasswordData: VerifyTokenAndResetPasswordDTO = {
            Token: token,
            Password: data.newPassword,
        }

        const response = await axios.post(
            `${apiBaseURL}/VerifyTokenAndResetPassword`,
            resetPasswordData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        if (response.status === 200) {
            addAlert({
                id: 'reset-password-success',
                severity: 'success',
                message: 'Password reset successfully',
                timeout: 5,
                handleDismiss: null,
            })
            navigate('/')
        } else {
            console.error('Failed to reset password')
            addAlert({
                id: 'reset-password-failed',
                severity: 'error',
                message: 'Failed to reset password',
                timeout: 5,
                handleDismiss: null,
            })
        }
        // Add your logic to handle password reset here
    }

    const newPassword = watch('newPassword')

    return (
        <div className="container flex flex-col items-center">
            <h1 className="text-center font-bold mt-4">Reset Password</h1>
            <form
                className="flex flex-col space-y-4 w-72 sm:w-128"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col">
                    <label>
                        New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('newPassword', {
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
                    {errors.newPassword && (
                        <span className="text-red-500">
                            {errors.newPassword.message?.toString()}
                        </span>
                    )}
                </div>
                <div className="flex flex-col">
                    <label>
                        Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        className="border border-gray-300 rounded p-2 w-50"
                        {...register('confirmPassword', {
                            required: {
                                value: true,
                                message: 'This field is required',
                            },
                            validate: (value) =>
                                value === newPassword ||
                                'Passwords do not match',
                        })}
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-500">
                            {errors.confirmPassword.message?.toString()}
                        </span>
                    )}
                </div>
                <div className="flex flex-row space-x-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded p-2"
                    >
                        Reset Password
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword
