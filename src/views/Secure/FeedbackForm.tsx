import { useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { useNavigate } from 'react-router-dom'
import { FullFeedbackFormDTO } from '../../DTOs/FeedbackDTOs'

const FeedbackForm = () => {
    const { token, user } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleContinue = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BackendURL}/tenants/${
                    user?.tenantId
                }/users/${user?.userId}/feedbackforms`,
                {
                    // Add the necessary data payload here
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (response.status === 200) {
                console.log('Feedback form submitted successfully')
                // Add any additional logic here, such as navigation or state updates
                const feedback: FullFeedbackFormDTO = response.data
                navigate(`/secure/feedback/${feedback.id}`)
            } else {
                console.error(
                    'Failed to submit feedback form:',
                    response.statusText
                )
            }
        } catch (error) {
            console.error('Error submitting feedback form:', error)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Feedback Form</h1>
            <p>Thank you for participating in the evaluation of TAIMSCORE</p>
            <h2 className="text-xl mb-4 mt-4">Overview</h2>
            <p>
                This feedback document provides an opportunity for you to
                comment on the design, utility and functional specifications of
                TAIMSCORE. Your input is an important part of our development
                and continual improvement process and is considered by HISPI.org
                to be essential to the long-term success of this product.
            </p>
            <h2 className="text-xl mb-4 mt-4">General Instructions</h2>
            <ol className="list-decimal">
                <li>Please complete the task below.</li>
                <li>Please answer the questions on the attached forms.</li>
            </ol>
            <h2 className="text-xl mb-4 mt-4">Evaluation Objectives</h2>
            <ul className="list-disc">
                <li>Evaluate software technical content</li>
                <li>Evaluate Software ease of use</li>
                <li>Evaluate user Documentation</li>
                <li>Identify errors</li>
            </ul>
            <h2 className="text-xl mb-4 mt-4">Evaluation Tasks</h2>
            <ol className="list-decimal">
                <li>Review the other documentation provided.</li>
                <li>
                    Take brief notes on ant errors, problems, confusion,ideas,
                    or comments.
                </li>
                <li>
                    A convenient way to do this is to have Word open at the same
                    time as the software, and then move back and forth between
                    the two applications.
                </li>
                <li>Answer the questions on the next screen</li>
            </ol>
            <div className="flex flex-row mt-4 gap-2">
                <button
                    onClick={() => navigate('/secure/dashboard')}
                    className="bg-red-700 p-2 text-white rounded w-60 flex flex-row items-center justify-center"
                >
                    Cancel
                </button>
                <button
                    onClick={handleContinue}
                    className="bg-blue-700 p-2 text-white rounded w-60 flex flex-row items-center justify-center"
                >
                    Continue
                </button>
            </div>
        </div>
    )
}

export default FeedbackForm
