import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import axios from 'axios'
import { AssessmentImportDoneDTO } from '../../DTOs/AssessmentImportDoneDTO'
import { AssessmentWithMappingsDTO } from '../../DTOs/AssessmentWithMappingsDTO'

const apiBaseURL = import.meta.env.VITE_BackendURL

const ConfirmDataMappings = () => {
    const { assessmentWithMappings, token, setAssessmentImportDone } =
        useContext(AuthContext)
    const navigate = useNavigate()

    const handleConfirm = async () => {
        // Add your logic to handle the confirmation here
        console.log('Confirmed Mappings:', assessmentWithMappings)

        //Send a POST request to the backend to save the mappings and standard
        const response = await axios.post(
            `${apiBaseURL}/ImportAssessmentWithMappings`,
            assessmentWithMappings as AssessmentWithMappingsDTO,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (response.status === 200) {
            //convert axios reponse data to AssessmentImportDoneDTO
            const doneData: AssessmentImportDoneDTO = response.data
            setAssessmentImportDone(doneData)
            navigate('/secure/import-data/import-done') // Redirect to the assessment page
        }
    }

    const handleGoBack = () => {
        navigate(-1) // Go back to the previous page
    }

    if (!assessmentWithMappings) {
        navigate('/secure/import-data') // Redirect back to import data page
    }

    return (
        <div className="container flex flex-col gap-4 p-4">
            <h1 className="text-xl font-bold mb-4">Confirm Data Mappings</h1>
            <p>
                Please review the Column Headers Mappings before performing the
                import of the new Assessment Standard
            </p>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-500">
                            <th className="border p-2 w-136">Column Header</th>
                            <th className="border p-2">Mapped Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(
                            assessmentWithMappings
                                ? assessmentWithMappings.mappings
                                : []
                        ).map(([columnName, mappedType]) => (
                            <tr key={columnName}>
                                <td className="border p-2 font-bold">
                                    {columnName}
                                </td>
                                <td className="border p-2">{mappedType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-4">
                <button
                    onClick={handleConfirm}
                    className="bg-blue-500 text-white rounded p-2"
                >
                    Confirm
                </button>
                <button
                    onClick={handleGoBack}
                    className="bg-red-500 text-white rounded p-2"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default ConfirmDataMappings
