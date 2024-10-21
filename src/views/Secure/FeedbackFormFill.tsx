import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { Button } from '@material-tailwind/react'
import { FullFeedbackFormDTO } from '../../DTOs/FeedbackDTOs'

interface FeedbackFillForm {
    feedbackFormId: number
    tenantId: number
    createdUserId: number
    createdDate: Date
    comment: string
    sections: FeedbackFillSection[]
}

interface FeedbackFillSection {
    sectionId: number
    sectionName: string
    questions: FeedbackFillQuestion[]
}

interface FeedbackFillQuestion {
    questionId: number
    questionText: string
    rating: number
    comment: string
}

const FeedbackFormFill = () => {
    const { feedbackFormId } = useParams<{ feedbackFormId: string }>()
    const { token } = useContext(AuthContext)
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
        reset,
    } = useForm<FullFeedbackFormDTO>()

    const [FeedbackFillForm, setFeedbackFillForm] =
        useState<FeedbackFillForm | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchFeedbackForm = async () => {
            try {
                const response = await axios.get(
                    `${
                        import.meta.env.VITE_BackendURL
                    }/feedbackforms/${feedbackFormId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    const feedbackForm: FullFeedbackFormDTO = response.data
                    reset(feedbackForm)
                    // Convert the feedbackForm to the FeedbackFillForm interface
                    const sections: FeedbackFillSection[] = []
                    // Group the feedback form details by section
                    feedbackForm.feedbackFormDetails.forEach((detail) => {
                        const sectionIndex = sections.findIndex(
                            (section) => section.sectionId === detail.sectionId
                        )
                        if (sectionIndex === -1) {
                            sections.push({
                                sectionId: detail.sectionId,
                                sectionName: detail.sectionName!,
                                questions: [
                                    {
                                        questionId: detail.questionId,
                                        questionText: detail.questionText!,
                                        rating: detail.rating,
                                        comment: detail.comment,
                                    },
                                ],
                            })
                        } else {
                            sections[sectionIndex].questions.push({
                                questionId: detail.questionId,
                                questionText: detail.questionText!,
                                rating: detail.rating,
                                comment: detail.comment,
                            })
                        }
                    })
                    const feedbackFillForm: FeedbackFillForm = {
                        feedbackFormId: feedbackForm.id!,
                        tenantId: feedbackForm.tenantId,
                        createdUserId: feedbackForm.createdUserId,
                        createdDate: feedbackForm.createdDate,
                        comment: feedbackForm.comment,
                        sections: sections,
                    }
                    setFeedbackFillForm(feedbackFillForm)
                } else {
                    console.error(
                        'Failed to fetch feedback form:',
                        response.statusText
                    )
                }
            } catch (error) {
                console.error('Error fetching feedback form:', error)
            }
        }

        fetchFeedbackForm()
    }, [feedbackFormId, token, setValue])

    const onSubmit = async (data: FullFeedbackFormDTO) => {
        try {
            const response = await axios.put(
                `${
                    import.meta.env.VITE_BackendURL
                }/feedbackforms/${feedbackFormId}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 200) {
                console.log('Feedback form submitted successfully')
                navigate('/secure/dashboard')
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
    let questionIndex = 0
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Fill Feedback Form</h1>
            <p>All questions are mandatory.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                {FeedbackFillForm && (
                    <div>
                        {FeedbackFillForm.sections.map((section) => {
                            return (
                                <div key={section.sectionId}>
                                    <h2 className="text-xl mb-4 mt-10">
                                        {section.sectionName}
                                    </h2>
                                    <table className="border">
                                        <thead>
                                            <tr className="border">
                                                <th className="border">
                                                    Question
                                                </th>
                                                <th className="border">
                                                    Select Rating
                                                </th>
                                                <th className="border">
                                                    Comments
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {section.questions.map(
                                                (question) => {
                                                    return (
                                                        <tr
                                                            key={
                                                                question.questionId
                                                            }
                                                            className="border"
                                                        >
                                                            <td className="p-2 w-96 border">
                                                                {
                                                                    question.questionText
                                                                }
                                                            </td>
                                                            <td className="border">
                                                                <Controller
                                                                    name={`feedbackFormDetails.${questionIndex}.rating`}
                                                                    control={
                                                                        control
                                                                    }
                                                                    rules={{
                                                                        required:
                                                                            true,
                                                                    }}
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <select
                                                                            {...field}
                                                                        >
                                                                            <option value="0">
                                                                                --SELECT--
                                                                            </option>
                                                                            <option value="1">
                                                                                1
                                                                                -
                                                                                Poor
                                                                            </option>
                                                                            <option value="2">
                                                                                2
                                                                                -
                                                                                Average
                                                                            </option>
                                                                            <option value="3">
                                                                                3
                                                                                -
                                                                                Good
                                                                            </option>
                                                                            <option value="4">
                                                                                4
                                                                                -
                                                                                Very
                                                                                Good
                                                                            </option>
                                                                            <option value="5">
                                                                                5
                                                                                -
                                                                                Excellent
                                                                            </option>
                                                                        </select>
                                                                    )}
                                                                />
                                                                {errors.feedbackFormDetails &&
                                                                    errors
                                                                        .feedbackFormDetails[
                                                                        questionIndex
                                                                    ]
                                                                        ?.rating && (
                                                                        <span className="text-red-500">
                                                                            This
                                                                            field
                                                                            is
                                                                            required
                                                                        </span>
                                                                    )}
                                                            </td>
                                                            <td className="border">
                                                                <Controller
                                                                    name={`feedbackFormDetails.${questionIndex++}.comment`}
                                                                    control={
                                                                        control
                                                                    }
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <input
                                                                            {...field}
                                                                        />
                                                                    )}
                                                                />
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        })}
                    </div>
                )}
                <label className="block mt-4">Additional Comments:</label>
                <textarea
                    {...register('comment', { required: true })}
                    className="border border-gray-300 rounded p-2 w-full"
                />
                <Button
                    type="submit"
                    variant="gradient"
                    color="green"
                    className="mt-4"
                >
                    Submit Feedback
                </Button>
            </form>
        </div>
    )
}

export default FeedbackFormFill
