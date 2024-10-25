import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { Spinner } from '@material-tailwind/react'
import { AssessmentProfileDTO } from '../../DTOs/AssessmentProfileDTO'
import { AssessmentStandardDTO } from '../../DTOs/AssessmentStandardDTO'
import { FullAssessmentStandardDTO } from '../../DTOs/FullAssessmentStandardDTO'
import {
    AssessmentCreateDTO,
    AssessmentDTO,
    FullAssessmentDTO,
} from '../../DTOs/FullAssessmentDTO'
import { useNavigate } from 'react-router-dom'
interface AssessmentErrors {
    profile: string
    standard: string
    version: string
    name: string
}

const Assessment = () => {
    const navigate = useNavigate()
    const { token, user } = useContext(AuthContext)
    const [assessmentProfiles, setAssessmentProfiles] = useState<
        AssessmentProfileDTO[]
    >([])
    const [assessmentStandards, setAssessmentStandards] = useState<
        AssessmentStandardDTO[]
    >([])

    const [assessmentVersions, setAssessmentVersions] = useState<
        FullAssessmentStandardDTO[]
    >([])

    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
        null
    )
    const [selectedStandardId, setSelectedStandardId] = useState<number | null>(
        null
    )

    const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
        null
    )
    const [previousAssessments, setPreviousAssessments] = useState<
        AssessmentDTO[]
    >([])

    const [assessmentName, setAssessmentName] = useState('')
    const [loadingAssessments, setLoadingAssessments] = useState(false)
    const [loadingVersions, setLoadingVersions] = useState(false)
    const [loadingPreviousAssessments, setLoadingPreviousAssessments] =
        useState(false)
    const [errors, setErrors] = useState<AssessmentErrors>({
        profile: '',
        standard: '',
        version: '',
        name: '',
    })
    const [creatingAssessment, setCreatingAssessment] = useState(false)

    useEffect(() => {
        const fetchAssessmentProfiles = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/tenants/${
                        user?.tenantId
                    }/assessmentprofiles`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setAssessmentProfiles(response.data)
                } else {
                    console.error(
                        'Failed to fetch assessment profiles:',
                        response.statusText
                    )
                }
            } catch (error: any) {
                console.error('Error fetching assessment profiles:', error)
                if (error.response.status === 401) {
                    navigate('/')
                }
            }
        }

        fetchAssessmentProfiles()
    }, [token, user?.tenantId])

    useEffect(() => {
        if (selectedProfileId) {
            const selectedProfile = assessmentProfiles.find(
                (profile) => profile.id === selectedProfileId
            )

            if (selectedProfile) {
                const assessmentStandardId =
                    selectedProfile.assessmentStandardId
                const fetchAssessmentStandards = async () => {
                    try {
                        setLoadingAssessments(true)
                        const response = await axios.get(
                            `${
                                import.meta.env.VITE_BackendURL
                            }/assessmentstandards/${assessmentStandardId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        )
                        if (response.status === 200) {
                            setAssessmentStandards([response.data])
                        } else {
                            console.error(
                                'Failed to fetch assessment standards:',
                                response.statusText
                            )
                        }
                        setLoadingAssessments(false)
                    } catch (error: any) {
                        setLoadingAssessments(false)
                        console.error(
                            'Error fetching assessment standards:',
                            error
                        )
                        if (error.response.status === 401) {
                            navigate('/')
                        }
                    }
                }
                fetchAssessmentStandards()
            }
        }
    }, [selectedProfileId, token, user?.tenantId])

    useEffect(() => {
        if (selectedStandardId) {
            const selectedStandard = assessmentStandards.find(
                (standard) => standard.id === selectedStandardId
            )

            const fetchAssessmentVersions = async () => {
                try {
                    setLoadingVersions(true)
                    const response = await axios.get(
                        `${
                            import.meta.env.VITE_BackendURL
                        }/assessmentstandards/name/${
                            selectedStandard?.standardName
                        }`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                    if (response.status === 200) {
                        setAssessmentVersions(response.data)
                    } else {
                        console.error(
                            'Failed to fetch assessment versions:',
                            response.statusText
                        )
                    }
                    setLoadingVersions(false)
                } catch (error: any) {
                    setLoadingVersions(false)
                    console.error('Error fetching assessment versions:', error)
                    if (error.response.status === 401) {
                        navigate('/')
                    }
                }
            }
            fetchAssessmentVersions()
        }
    }, [selectedStandardId, token, user?.tenantId])

    const performAssessment = async () => {
        let hasErrors = false
        const newErrors: AssessmentErrors = {
            profile: '',
            standard: '',
            version: '',
            name: '',
        }

        if (!selectedProfileId) {
            hasErrors = true
            newErrors.profile = 'Please select an assessment profile'
        }

        if (!selectedStandardId) {
            hasErrors = true
            newErrors.standard = 'Please select an assessment standard'
        }

        if (!selectedVersionId) {
            hasErrors = true
            newErrors.version = 'Please select an assessment version'
        }

        if (!assessmentName) {
            hasErrors = true
            newErrors.name = 'Please enter an assessment name'
        }

        setErrors(newErrors)
        if (hasErrors) {
            return
        }

        // Perform assessment
        // Call backend to create a new assessment and then navigate to the assessment page
        const payload: AssessmentCreateDTO = {
            tenantId: user?.tenantId!,
            createdUserId: user?.userId!,
            assessmentStandardId: selectedVersionId!,
            assessmentProfileId: selectedProfileId!,
            assessmentName: assessmentName,
        }

        try {
            setCreatingAssessment(true)
            const response = await axios.post(
                `${import.meta.env.VITE_BackendURL}/assessments`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (response.status === 200) {
                // Navigate to the assessment page
                const createdAssessment: FullAssessmentDTO = response.data
                navigate(`/secure/assessment/fill/${createdAssessment.id}`)
            } else {
                console.error(
                    'Failed to create assessment:',
                    response.statusText
                )
            }
            setCreatingAssessment(false)
        } catch (error) {
            setCreatingAssessment(false)
            console.error('Error creating assessment:', error)
        }
    }

    useEffect(() => {
        const fetchPreviousAssessments = async () => {
            try {
                setLoadingPreviousAssessments(true)
                const response = await axios.get(
                    `${import.meta.env.VITE_BackendURL}/tenants/${
                        user?.tenantId
                    }/standards/${selectedVersionId}/assessments`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setPreviousAssessments(response.data)
                } else {
                    console.error(
                        'Failed to fetch previous assessments:',
                        response.statusText
                    )
                }
                setLoadingPreviousAssessments(false)
            } catch (error) {
                setLoadingPreviousAssessments(false)
                console.error('Error fetching previous assessments:', error)
            }
        }

        if (
            selectedVersionId &&
            selectedVersionId !== null &&
            selectedVersionId !== 0
        ) {
            fetchPreviousAssessments()
        }
    }, [selectedVersionId, token, user])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Start Assessment</h1>
            <div className="flex flex-row mb-4 gap-4">
                <div className="flex flex-col flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Assessment Profile
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
                        {assessmentProfiles.map((profile) => (
                            <option key={profile.id} value={profile.id}>
                                {profile.profileName}
                            </option>
                        ))}
                    </select>
                    {errors.profile && (
                        <span className="text-red-500">{errors.profile}</span>
                    )}
                </div>
                <div className="flex flex-col flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Assessment Standard
                    </label>
                    <div className="flex flex-row justify-center items-center">
                        {loadingAssessments && <Spinner />}
                        <select
                            value={selectedStandardId || ''}
                            onChange={(e) =>
                                setSelectedStandardId(Number(e.target.value))
                            }
                            className="mt-1 block w-full"
                            disabled={loadingAssessments}
                        >
                            <option value="" disabled>
                                Select an assessment standard
                            </option>
                            {assessmentStandards.map((standard) => (
                                <option key={standard.id} value={standard.id}>
                                    {standard.standardName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.standard && (
                        <span className="text-red-500">{errors.standard}</span>
                    )}
                </div>
                <div className="flex flex-col flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Standard Version
                    </label>
                    <div className="flex flex-row justify-center items-center">
                        {loadingVersions && <Spinner />}
                        <select
                            value={selectedVersionId || ''}
                            onChange={(e) =>
                                setSelectedVersionId(Number(e.target.value))
                            }
                            className="mt-1 block w-full"
                            disabled={loadingVersions}
                        >
                            <option value="" disabled>
                                Select an standard version
                            </option>
                            {assessmentVersions.map((standard) => (
                                <option
                                    key={`ver-${standard.id}`}
                                    value={standard.id}
                                >
                                    {standard.standardVersion}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.version && (
                        <span className="text-red-500">{errors.version}</span>
                    )}
                </div>
            </div>
            <div className="flex flex-row mb-4 gap-4">
                <div className="flex flex-col flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                        New Assessment Name
                    </label>
                    <input
                        type="text"
                        value={assessmentName}
                        onChange={(e) => setAssessmentName(e.target.value)}
                        className="mt-1 block w-full"
                    />
                    {errors.name && (
                        <span className="text-red-500">{errors.name}</span>
                    )}
                </div>
                <div className="flex flex-row flex-1 items-center align-middle">
                    {creatingAssessment && (
                        <Spinner color="blue" className="w-6 h-6" />
                    )}
                    <button
                        disabled={creatingAssessment}
                        onClick={performAssessment}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
                    >
                        Perform Assessment
                    </button>
                </div>
                <div className="flex flex-col flex-1"></div>
            </div>
            {loadingPreviousAssessments && <Spinner color="blue" />}
            {previousAssessments.length > 0 && (
                <div className="w-full">
                    <h2 className="mt-4">Previous Assessments</h2>
                    <table>
                        <thead>
                            <tr>
                                <th className="border border-black w-80 p-2">
                                    Assessment Name
                                </th>
                                <th className="border border-black p-2">
                                    Is Complete
                                </th>
                                <th className="border border-black p-2">
                                    Overall Score
                                </th>
                                <th className="border border-black p-2">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {previousAssessments.map((assessment) => (
                                <tr key={assessment.id}>
                                    <td className="border border-black p-2">
                                        {assessment.assessmentName}
                                    </td>
                                    <td className="border border-black p-2">
                                        {assessment.isCompleted ? 'Yes' : 'No'}
                                    </td>
                                    <td className="border border-black p-2">
                                        {(
                                            assessment.overallRating * 100
                                        ).toFixed(2)}
                                    </td>

                                    <td className="border border-black p-2">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/secure/assessment/fill/${assessment.id}`
                                                )
                                            }
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                        >
                                            View/Edit Assessment
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Assessment
