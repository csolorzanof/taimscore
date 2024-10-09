import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary

const AssessmentImportDone = () => {
    const { assessmentImportDone } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!assessmentImportDone) {
            navigate('/secure/import-assessment') // Redirect to import assessment page
        }
    }, [assessmentImportDone, navigate])

    const handleClose = () => {
        navigate('/secure/assessment') // Navigate to the assessments page
    }

    if (!assessmentImportDone) {
        return <div>Loading...</div>
    }

    return (
        <div className="container flex flex-col gap-4 p-4">
            <h1 className="text-xl font-bold mb-4">Import Results</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-500">
                            <th className="border p-2">Column Name</th>
                            <th className="border p-2">Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(assessmentImportDone).map(
                            ([columnName, result]) => (
                                <tr key={columnName}>
                                    <td className="border p-2 font-bold">
                                        {columnName}
                                    </td>
                                    <td className="border p-2">{result}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-4">
                <button
                    onClick={handleClose}
                    className="bg-gray-500 text-white rounded p-2"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default AssessmentImportDone
