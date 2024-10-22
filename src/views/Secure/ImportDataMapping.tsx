import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../AuthProvider'
import { AssessmentWithMappingsDTO } from '../../DTOs/AssessmentWithMappingsDTO'

const columnTypes = [
    'Control Section ID',
    'Control Section',
    'Control Objective',
    'Question',
    'Question Objective',
    'Question Reference',
    'Top 20 Score',
    'HISPI Module',
    'Recommendation',
    'Control Mapping',
]

const requiredTypes = [
    'Control Section ID',
    'Control Section',
    'Control Objective',
    'Question',
    'Question Objective',
    'Question Reference',
    'Top 20 Score',
    'Recommendation',
]

const ImportDataMapping = () => {
    const { importData, setAssessmentWithMappings, user } =
        useContext(AuthContext)
    const navigate = useNavigate()
    const [columnMappings, setColumnMappings] = useState<{
        [key: string]: string
    }>({})
    const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())
    const [errors, setErrors] = useState<string[]>([])

    useEffect(() => {
        if (!importData) {
            // Redirect back to import data page
            navigate('/secure/import-data')
        }
    }, [importData, navigate])

    const handleMappingChange = (columnName: string, type: string) => {
        setColumnMappings((prevMappings) => {
            const newMappings = { ...prevMappings }
            const previousType = newMappings[columnName]

            if (previousType) {
                selectedTypes.delete(previousType)
            }

            if (type === 'Control Mapping') {
                if (previousType === type) {
                    delete newMappings[columnName]
                } else {
                    newMappings[columnName] = type
                }
            } else {
                newMappings[columnName] = type
            }

            selectedTypes.add(type)
            return newMappings
        })
    }

    const handleClearMapping = (columnName: string) => {
        setColumnMappings((prevMappings) => {
            const newMappings = { ...prevMappings }
            const previousType = newMappings[columnName]

            if (previousType) {
                selectedTypes.delete(previousType)
            }

            delete newMappings[columnName]

            return newMappings
        })
    }

    const handleMarkEmptyRows = () => {
        setColumnMappings((prevMappings) => {
            const newMappings = { ...prevMappings }
            importData?.ColumnNames.forEach((columnName: string) => {
                if (!newMappings[columnName]) {
                    newMappings[columnName] = 'Control Mapping'
                    selectedTypes.add('Control Mapping')
                }
            })
            return newMappings
        })
    }

    const handleClearAllMappings = () => {
        setColumnMappings({})
        setSelectedTypes(new Set())
    }

    const handleSubmit = () => {
        const newErrors: string[] = []

        // Check if all required types are selected
        requiredTypes.forEach((type) => {
            if (!Array.from(selectedTypes).includes(type)) {
                newErrors.push(`${type} is required`)
            }
        })

        // Check if at least one Control Mapping is selected
        if (!Array.from(selectedTypes).includes('Control Mapping')) {
            newErrors.push('At least one Control Mapping must be selected')
        }

        if (newErrors.length > 0) {
            setErrors(newErrors)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            setErrors([])
            console.log('Column Mappings:', columnMappings)
            const assessmentWithMappings: AssessmentWithMappingsDTO = {
                assessmentName: importData ? importData.StandardName : '',
                assessmentVersion: importData ? importData.StandardVersion : '',
                mappings: columnMappings,
                records: importData?.JsonResult as object[],
                tenantId: user?.tenantId as number,
                userId: user?.userId as number,
            }
            setAssessmentWithMappings(assessmentWithMappings)
            navigate('/secure/import-data/mapping-confirm')
        }
    }

    if (!importData) {
        return null
    }

    return (
        <div className="container flex flex-col gap-4 p-4">
            <h1 className="text-xl font-bold mb-4">Map Columns</h1>
            {errors.length > 0 && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <p>
                Please map each header to one of the assessments control
                section.
            </p>
            <div className="overflow-x-clip">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-500">
                            <th className="border p-2 sticky top-0 bg-gray-500">
                                Column Header
                            </th>
                            {columnTypes.map((type) => (
                                <th
                                    key={type}
                                    className="border p-2 sticky top-0 bg-gray-500"
                                    style={{
                                        writingMode: 'vertical-rl',
                                        transform: 'rotate(180deg)',
                                        height: '180px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {type}
                                </th>
                            ))}
                            <th className="border p-2 sticky top-0 bg-gray-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {importData.ColumnNames.map((columnName: string) => (
                            <tr key={columnName}>
                                <td className="border p-2 font-bold">
                                    {columnName}
                                </td>
                                {columnTypes.map((type) => (
                                    <td
                                        key={type}
                                        className="border p-2 text-center"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                columnMappings[columnName] ===
                                                type
                                            }
                                            onChange={() =>
                                                handleMappingChange(
                                                    columnName,
                                                    type
                                                )
                                            }
                                            disabled={
                                                type !== 'Control Mapping' &&
                                                selectedTypes.has(type) &&
                                                columnMappings[columnName] !==
                                                    type
                                            }
                                        />
                                    </td>
                                ))}
                                <td className="border p-2 text-center">
                                    <button
                                        onClick={() =>
                                            handleClearMapping(columnName)
                                        }
                                        className="bg-red-500 text-white rounded p-2"
                                    >
                                        Clear
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-4">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white rounded p-2"
                >
                    Submit Mappings
                </button>
                <button
                    onClick={handleMarkEmptyRows}
                    className="bg-green-500 text-white rounded p-2"
                >
                    Mark Empty Rows as Control Mapping
                </button>
                <button
                    onClick={handleClearAllMappings}
                    className="bg-red-500 text-white rounded p-2"
                >
                    Clear All Mappings
                </button>
            </div>
        </div>
    )
}

export default ImportDataMapping
