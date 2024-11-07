import { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../AuthProvider'
import { FullAssessmentDTO } from '../../DTOs/FullAssessmentDTO'
import {
    Tooltip,
    Spinner,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from '@material-tailwind/react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { AlertsContext } from '../../components/alerts/Alerts-Context'

const AssessmentFill = () => {
    const { token, user } = useContext(AuthContext)
    const { assessmentId } = useParams<{ assessmentId: string }>()
    const { addAlert } = useContext(AlertsContext)
    const [assessment, setAssessment] = useState<FullAssessmentDTO | null>(null)
    const [loading, setLoading] = useState(false)
    const [sectionOpen, setSectionOpen] = useState<number | null>(null)
    const [subControlOpen, setSubControlOpen] = useState<number | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        getValues,
    } = useForm<FullAssessmentDTO>()

    useEffect(() => {
        const fetchAssessment = async () => {
            setLoading(true)
            console.log('Fetching assessment:', assessmentId)
            // Fetch the assessment from the backend
            const response = await axios.get(
                `${
                    import.meta.env.VITE_BackendURL
                }/assessments/${assessmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 200) {
                setAssessment(response.data)
                reset(response.data)
            } else {
                console.error(
                    'Failed to fetch assessment:',
                    response.statusText
                )
            }
            setLoading(false)
        }
        if (assessmentId) {
            fetchAssessment()
        }
    }, [assessmentId, token, user])

    if (loading || !assessment) {
        return (
            <div className="container mx-auto p-4">
                <Spinner color="blue" />
            </div>
        )
    }

    const onSubmit = async (data: FullAssessmentDTO) => {
        setLoading(true)
        console.log('Submitting assessment:', data)
        // Submit the assessment to the backend
        const response = await axios.put(
            `${import.meta.env.VITE_BackendURL}/assessments/${assessmentId}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (response.status === 200) {
            addAlert({
                id: 'assessment-saved',
                message: 'Assessment saved successfully',
                timeout: 5,
                severity: 'success',
                handleDismiss: null,
            })
        } else {
            addAlert({
                id: 'assessment-save-failed',
                message: 'Failed to save assessment',
                timeout: 5,
                severity: 'error',
                handleDismiss: null,
            })
        }
        setLoading(false)
    }

    const recalculateRatings = (groupIndex: number, subGroupIndex: number) => {
        //Recalculate the rating at the subGroupLevel
        let base = 0
        let numerator = 0
        assessment.controlGroups[groupIndex].subControlGroups[
            subGroupIndex
        ].questions.forEach((q) => {
            if (q.responseCode !== 3) {
                base += Number(q.top20Rating)

                if (q.responseCode !== 1) {
                    numerator += Number(q.top20Rating)
                }
            }
        })

        let rating = 1
        if (base !== 0) rating = numerator / base
        setValue(
            `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.rating`,
            rating
        )
        assessment.controlGroups[groupIndex].subControlGroups[
            subGroupIndex
        ].rating = rating

        //Recalculate the rating at the group level
        base = 0
        numerator = 0
        assessment.controlGroups[groupIndex].subControlGroups.forEach((s) => {
            s.questions.forEach((q) => {
                if (q.responseCode !== 3) {
                    base += Number(q.top20Rating)

                    if (q.responseCode !== 1) {
                        numerator += Number(q.top20Rating)
                    }
                }
            })
        })
        if (base === 0) rating = 1
        else rating = numerator / base
        setValue(`controlGroups.${groupIndex}.rating`, rating)
        assessment.controlGroups[groupIndex].rating = rating

        //Recalculate the overall rating
        base = 0
        numerator = 0
        assessment.controlGroups.forEach((g) => {
            g.subControlGroups.forEach((s) => {
                s.questions.forEach((q) => {
                    if (q.responseCode !== 3) {
                        base += Number(q.top20Rating)

                        if (q.responseCode !== 1) {
                            numerator += Number(q.top20Rating)
                        }
                    }
                })
            })
        })
        if (base === 0) rating = 1
        else rating = numerator / base
        setValue('overallRating', rating)
        assessment.overallRating = rating

        //Recalculate the top 20 rating
        base = 0
        numerator = 0
        assessment.controlGroups.forEach((g) => {
            g.subControlGroups.forEach((s) => {
                s.questions.forEach((q) => {
                    if (q.responseCode !== 3) {
                        base += Number(q.top20Rating)

                        if (q.responseCode !== 1) {
                            numerator += Number(q.top20Rating)
                        }
                    }
                })
            })
        })
        if (base === 0) rating = 1
        else rating = numerator / base
        setValue('top20ControlsRating', rating)
        assessment.top20ControlsRating = rating

        //Recalculate for each data mapping
        assessment.mappingRatings.forEach((m, index) => {
            base = 0
            numerator = 0
            assessment.controlGroups.forEach((g) => {
                g.subControlGroups.forEach((s) => {
                    s.questions.forEach((q) => {
                        const relatedTo = q.mappings.split('|||')
                        const relatedMapping = relatedTo.find((r) => {
                            if (r.trim().includes(m.mappingName))
                                return r.trim()
                        })
                        const parts = relatedMapping?.split(':')
                        const value = parts
                            ? parts[parts.length - 1].trim()
                            : ''
                        if (
                            value !== undefined &&
                            value !== null &&
                            value !== ''
                        ) {
                            if (q.responseCode !== 3) {
                                base += Number(q.top20Rating)

                                if (q.responseCode !== 1) {
                                    numerator += Number(q.top20Rating)
                                }
                            }
                        }
                    })
                })
            })
            if (base === 0) rating = 1
            else rating = numerator / base
            m.rating = rating
            setValue(`mappingRatings.${index}.rating`, rating)
        })

        setAssessment({ ...assessment })
    }

    const recalculateComplete = () => {
        let assessmentComplete = true
        assessment.controlGroups.forEach((g, groupIndex) => {
            let groupComplete = true
            g.subControlGroups.forEach((s, subGroupIndex) => {
                let subControlGroupComplete = true
                s.questions.forEach((q, questionIndex) => {
                    if (q.responseCode === 0) {
                        subControlGroupComplete = false
                        q.isAnswered = false
                        setValue(
                            `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.questions.${questionIndex}.isAnswered`,
                            false
                        )
                    } else {
                        q.isAnswered = true
                        setValue(
                            `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.questions.${questionIndex}.isAnswered`,
                            true
                        )
                    }
                })
                s.isComplete = subControlGroupComplete
                setValue(
                    `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.isComplete`,
                    subControlGroupComplete
                )
                if (!subControlGroupComplete) {
                    groupComplete = false
                }
            })
            g.isComplete = groupComplete
            setValue(`controlGroups.${groupIndex}.isComplete`, groupComplete)
            if (!groupComplete) {
                assessmentComplete = false
            }
        })
        assessment.isCompleted = assessmentComplete
        setValue('isCompleted', assessmentComplete)
        setAssessment({ ...assessment })
    }

    const handleMaturityChange = (
        value: number,
        groupIndex: number,
        subGroupIndex: number,
        questionIndex: number
    ) => {
        const responseCode = Number(
            getValues(
                `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.questions.${questionIndex}.responseCode`
            )
        )
        if (responseCode === 2 && value !== 2) {
            //Set the asociated maturity level to 1 - initial
            const maturityCode = 2
            setValue(
                `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.questions.${questionIndex}.maturityCode`,
                maturityCode
            )

            addAlert({
                id: 'maturity-warning',
                message:
                    'The maturity level can only be 1 - Initial when the response is No.',
                timeout: 5,
                severity: 'warning',
                handleDismiss: null,
            })
            return
        }

        if (responseCode === 3 && value !== 1) {
            //Set the asociated maturity level to 0 - N/A
            const maturityCode = 1
            setValue(
                `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.questions.${questionIndex}.maturityCode`,
                maturityCode
            )

            addAlert({
                id: 'maturity-warning',
                message:
                    'The maturity level can only be 0 - N/A when the response is N/A.',
                timeout: 5,
                severity: 'warning',
                handleDismiss: null,
            })
            return
        }
    }

    const handleResponseChange = (
        value: number,
        groupIndex: number,
        subGroupIndex: number,
        questionIndex: number
    ) => {
        const updateAssessment = { ...assessment }

        updateAssessment.controlGroups[groupIndex].subControlGroups[
            subGroupIndex
        ].questions[questionIndex].responseCode = value
        let responseText = ''
        switch (value) {
            case 1:
                responseText = 'Yes'
                break
            case 2:
                responseText = 'No'
                break
            case 3:
                responseText = 'N/A'
                break
            case 4:
                responseText = 'Partial'
                break
            default:
                responseText = ''
        }
        updateAssessment.controlGroups[groupIndex].subControlGroups[
            subGroupIndex
        ].questions[questionIndex].responseText = responseText
        setAssessment(updateAssessment)

        if (value === 2) {
            //Set the asociated maturity level to 1 - initial
            const maturityCode = 2
            setValue(
                `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.questions.${questionIndex}.maturityCode`,
                maturityCode
            )
            recalculateRatings(groupIndex, subGroupIndex)
            recalculateComplete()
            return
        }
        if (value === 3) {
            //Set the asociated maturity level to 0 - N/A
            const maturityCode = 1
            setValue(
                `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.questions.${questionIndex}.maturityCode`,
                maturityCode
            )
            recalculateRatings(groupIndex, subGroupIndex)
            recalculateComplete()
            return
        }
        setValue(
            `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.questions.${questionIndex}.maturityCode`,
            0
        )
        recalculateRatings(groupIndex, subGroupIndex)
        recalculateComplete()
    }

    return (
        <div className="container mx-auto p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-2xl font-bold mb-4">
                    Assessment: {assessment?.assessmentName}
                </h1>
                <div className="w-full mb-4 overflow-scroll">
                    <h2 className="text-xl mb-2">Non-Compliance Scores</h2>
                    <table className="bg-white border border-gray-700 mb-4">
                        <thead>
                            <tr>
                                <th
                                    className="py-2 px-4 border-gray-700 border bg-blue-300 hover:bg-blue-gray-300"
                                    style={{
                                        writingMode: 'vertical-rl',
                                        transform: 'rotate(180deg)',
                                        height: '180px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Overall Score
                                </th>
                                <th
                                    className="py-2 px-4 border-gray-700 border bg-blue-300 hover:bg-blue-gray-300"
                                    style={{
                                        writingMode: 'vertical-rl',
                                        transform: 'rotate(180deg)',
                                        height: '180px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Top 20 Score
                                </th>
                                {assessment?.mappingRatings?.map(
                                    (mapping, index) => (
                                        <th
                                            className="py-2 px-4 border-gray-700 border bg-blue-300 hover:bg-blue-gray-300"
                                            key={`mapping-head-${index}`}
                                            style={{
                                                writingMode: 'vertical-rl',
                                                transform: 'rotate(180deg)',
                                                height: '180px',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <Tooltip
                                                content={mapping.mappingName}
                                            >
                                                {mapping.mappingName.slice(
                                                    0,
                                                    20
                                                )}
                                            </Tooltip>
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border border-gray-700">
                                    {(assessment?.overallRating! * 100).toFixed(
                                        2
                                    )}
                                    %
                                </td>
                                <td className="py-2 px-4 border border-gray-700">
                                    {(
                                        assessment?.top20ControlsRating! * 100
                                    ).toFixed(2)}
                                    %
                                </td>
                                {assessment?.mappingRatings?.map(
                                    (mapping, index) => (
                                        <td
                                            key={`map-rating-${index}`}
                                            className="py-2 px-4 border border-gray-700"
                                        >
                                            {(mapping.rating! * 100).toFixed(2)}
                                            %
                                        </td>
                                    )
                                )}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h2>Control Groups</h2>
                <table>
                    <thead>
                        <tr>
                            <th className="w-36 border border-gray-400">
                                Group Name
                            </th>
                            <th className="w-36 border border-gray-400">
                                Is Complete
                            </th>
                            <th className="w-36 border border-gray-400">
                                Score
                            </th>
                        </tr>
                    </thead>
                </table>
                {assessment?.controlGroups?.map((group, groupIndex) => (
                    <Accordion
                        key={`control-group-${groupIndex}`}
                        color="blue"
                        className="mb-0"
                        open={sectionOpen === group.id}
                    >
                        <AccordionHeader
                            className="mt-0 py-0 hover:bg-blue-300 font-normal text-base"
                            onClick={() =>
                                setSectionOpen(
                                    sectionOpen === group.id ? null : group.id
                                )
                            }
                        >
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="w-36 border border-gray-400">
                                            {group.groupName}
                                        </td>
                                        <td className="w-36 border border-gray-400">
                                            {group.isComplete ? 'Yes' : 'No'}
                                        </td>
                                        <td className="w-36 border border-gray-400">
                                            {(group.rating * 100).toFixed(2)}%
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </AccordionHeader>
                        <AccordionBody>
                            <table>
                                <thead>
                                    <tr>
                                        <th className="w-36 border border-gray-400">
                                            Sub Group Name
                                        </th>
                                        <th className="w-80 border border-gray-400">
                                            Sub Group Objective
                                        </th>
                                        <th className="w-36 border border-gray-400">
                                            Is Complete
                                        </th>
                                        <th className="w-36 border border-gray-400">
                                            Questions
                                        </th>
                                        <th className="w-36 border border-gray-400">
                                            Score
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                            {group.subControlGroups?.map(
                                (subGroup, subGroupIndex) => (
                                    <Accordion
                                        key={`sub-group-${subGroupIndex}`}
                                        color="blue"
                                        className="mb-0"
                                        open={subControlOpen === subGroup.id}
                                    >
                                        <AccordionHeader
                                            className="mt-0 py-0 hover:bg-blue-400 font-normal text-base"
                                            onClick={() =>
                                                setSubControlOpen(
                                                    subControlOpen ===
                                                        subGroup.id
                                                        ? null
                                                        : subGroup.id
                                                )
                                            }
                                        >
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="w-36 border border-gray-400 p-2">
                                                            {
                                                                subGroup.subControlId
                                                            }
                                                        </td>
                                                        <td className="w-80 border border-gray-400 p-2 text-xs">
                                                            {
                                                                subGroup.subControlObjective
                                                            }
                                                        </td>
                                                        <td className="w-36 border border-gray-400 p-2">
                                                            {subGroup.isComplete
                                                                ? 'Yes'
                                                                : 'No'}
                                                        </td>
                                                        <td className="w-36 border border-gray-400 p-2">
                                                            {
                                                                subGroup
                                                                    .questions
                                                                    .length
                                                            }
                                                        </td>
                                                        <td className="w-36 border border-gray-400 p-2">
                                                            {(
                                                                subGroup.rating *
                                                                100
                                                            ).toFixed(2)}
                                                            %
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </AccordionHeader>
                                        <AccordionBody>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className="w-10 border border-gray-400">
                                                            No
                                                        </th>
                                                        <th className="w-64 border border-gray-400">
                                                            Question
                                                        </th>
                                                        <th className="w-36 border border-gray-400">
                                                            Related To
                                                        </th>
                                                        <th className="w-36 border border-gray-400">
                                                            Related AI Incident
                                                        </th>
                                                        <th className="w-36 border border-gray-400">
                                                            Top 20 Score
                                                        </th>
                                                        <th className="w-44 border border-gray-400">
                                                            Response
                                                        </th>
                                                        <th className="w-36 border border-gray-400">
                                                            Maturity Level
                                                        </th>
                                                        <th className="w-64 border border-gray-400">
                                                            Control Evidence
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {subGroup.questions?.map(
                                                        (
                                                            question,
                                                            questionIndex
                                                        ) => (
                                                            <tr
                                                                key={`question-${subGroup.id}-${questionIndex}`}
                                                            >
                                                                <td className="border border-gray-400 p-2">
                                                                    {questionIndex +
                                                                        1}
                                                                </td>
                                                                <td className="border border-gray-400 p-2 text-xs">
                                                                    {
                                                                        question.questionText
                                                                    }
                                                                </td>
                                                                <td
                                                                    className="border border-gray-400 p-2 text-xs"
                                                                    style={{
                                                                        whiteSpace:
                                                                            'pre-line',
                                                                    }}
                                                                >
                                                                    <div className="w-36 h-60 overflow-scroll text-nowrap">
                                                                        {question.mappings.replace(
                                                                            /\|\|\|/g,
                                                                            ''
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td
                                                                    className="border border-gray-400 p-2 text-xs"
                                                                    style={{
                                                                        whiteSpace:
                                                                            'pre-line',
                                                                    }}
                                                                >
                                                                    <div className="w-36 h-60 overflow-scroll text-nowrap">
                                                                        {
                                                                            question.relatedAIIncident
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td className="border border-gray-400 p-2 text-center">
                                                                    {
                                                                        question.top20Rating
                                                                    }
                                                                </td>
                                                                <td className="border border-gray-400 p-2">
                                                                    <select
                                                                        {...register(
                                                                            `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.questions.${questionIndex}.responseCode`
                                                                        )}
                                                                        className="w-44 border border-gray-400 p-2"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleResponseChange(
                                                                                Number(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                ),
                                                                                groupIndex,
                                                                                subGroupIndex,
                                                                                questionIndex
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value="0">
                                                                            --SELECT--
                                                                        </option>
                                                                        <option value="1">
                                                                            Yes
                                                                        </option>
                                                                        <option value="2">
                                                                            No
                                                                        </option>
                                                                        <option value="3">
                                                                            N/A
                                                                        </option>
                                                                        <option value="4">
                                                                            Partial
                                                                        </option>
                                                                    </select>
                                                                    {errors.controlGroups &&
                                                                        errors
                                                                            .controlGroups[
                                                                            groupIndex
                                                                        ] &&
                                                                        errors
                                                                            .controlGroups[
                                                                            groupIndex
                                                                        ]
                                                                            .subControlGroups &&
                                                                        errors
                                                                            .controlGroups[
                                                                            groupIndex
                                                                        ]
                                                                            .subControlGroups[
                                                                            subGroupIndex
                                                                        ] &&
                                                                        errors
                                                                            .controlGroups[
                                                                            groupIndex
                                                                        ]
                                                                            .subControlGroups[
                                                                            subGroupIndex
                                                                        ]
                                                                            .questions &&
                                                                        errors
                                                                            .controlGroups[
                                                                            groupIndex
                                                                        ]
                                                                            .subControlGroups[
                                                                            subGroupIndex
                                                                        ]
                                                                            .questions[
                                                                            questionIndex
                                                                        ]
                                                                            ?.responseCode && (
                                                                            <span className="text-red-500">
                                                                                This
                                                                                field
                                                                                is
                                                                                required
                                                                            </span>
                                                                        )}
                                                                </td>
                                                                <td className="border border-gray-400 p-2">
                                                                    <select
                                                                        {...register(
                                                                            `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.questions.${questionIndex}.maturityCode`
                                                                        )}
                                                                        className="border border-gray-400 p-2"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleMaturityChange(
                                                                                Number(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                ),
                                                                                groupIndex,
                                                                                subGroupIndex,
                                                                                questionIndex
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value="0">
                                                                            --SELECT--
                                                                        </option>
                                                                        <option value="1">
                                                                            0 -
                                                                            N/A
                                                                        </option>
                                                                        <option value="2">
                                                                            1 -
                                                                            Initial
                                                                        </option>
                                                                        <option value="3">
                                                                            2 -
                                                                            Managed
                                                                        </option>
                                                                        <option value="4">
                                                                            3 -
                                                                            Defined
                                                                        </option>
                                                                        <option value="5">
                                                                            4 -
                                                                            Quantitatively
                                                                            Managed
                                                                        </option>
                                                                        <option value="6">
                                                                            5 -
                                                                            Optimizing
                                                                        </option>
                                                                    </select>
                                                                    {errors.controlGroups &&
                                                                        errors
                                                                            .controlGroups[
                                                                            groupIndex
                                                                        ] &&
                                                                        errors
                                                                            .controlGroups[
                                                                            groupIndex
                                                                        ]
                                                                            .subControlGroups &&
                                                                        errors
                                                                            .controlGroups[
                                                                            groupIndex
                                                                        ]
                                                                            .subControlGroups[
                                                                            subGroupIndex
                                                                        ] &&
                                                                        errors
                                                                            .controlGroups[
                                                                            groupIndex
                                                                        ]
                                                                            .subControlGroups[
                                                                            subGroupIndex
                                                                        ]
                                                                            .questions &&
                                                                        errors
                                                                            .controlGroups[
                                                                            groupIndex
                                                                        ]
                                                                            .subControlGroups[
                                                                            subGroupIndex
                                                                        ]
                                                                            .questions[
                                                                            questionIndex
                                                                        ]
                                                                            ?.maturityCode && (
                                                                            <span className="text-red-500">
                                                                                This
                                                                                field
                                                                                is
                                                                                required
                                                                            </span>
                                                                        )}
                                                                </td>
                                                                <td className="border border-gray-400 p-2">
                                                                    <textarea
                                                                        {...register(
                                                                            `controlGroups.${groupIndex}.subControlGroups.${subGroupIndex}.questions.${questionIndex}.responseText`
                                                                        )}
                                                                        className="border border-gray-400 p-2 w-64 h-60"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </AccordionBody>
                                    </Accordion>
                                )
                            )}
                        </AccordionBody>
                    </Accordion>
                ))}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Save Responses
                </button>
            </form>
        </div>
    )
}

export default AssessmentFill
