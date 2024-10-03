import React, { useState, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider'
import { useNavigate } from 'react-router-dom'

const apiBaseURL = import.meta.env.VITE_BackendURL

const ImportData = () => {
    const [importType, setImportType] = useState('assessment-standard')
    const [assessmentAction, setAssessmentAction] = useState('new')
    const { token, setImportData } = useContext(AuthContext)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm()

    const handleImportTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setImportType(event.target.value)
    }

    const handleAssessmentActionChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setAssessmentAction(event.target.value)
    }

    const onSubmit = async (data: any) => {
        const formData = new FormData()
        formData.append('standardName', data.standardName)
        formData.append('standardVersion', data.standardVersion)
        formData.append('standardFile', data.standardFile)

        try {
            const response = await axios.post(
                `${apiBaseURL}/ImportAssessmentStandard`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            console.log('Import successful:', response.data)
            setImportData(response.data)
            navigate('/secure/import-data/mapping')
            // Handle successful import (e.g., show a success message)
        } catch (error) {
            console.error('Error importing standard:', error)
            // Handle error (e.g., show an error message)
        }
    }

    return (
        <div className="container flex flex-col gap-2 p-4">
            <h1 className="text-xl font-bold mb-4">Select Import Type</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
            >
                <div className="flex flex-col gap-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="assessment-standard"
                            checked={importType === 'assessment-standard'}
                            onChange={handleImportTypeChange}
                            className="mr-2"
                        />
                        Assessment Standard
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="knowledge-base"
                            checked={importType === 'knowledge-base'}
                            onChange={handleImportTypeChange}
                            className="mr-2"
                        />
                        Knowledge Base
                    </label>
                </div>
                {importType === 'assessment-standard' && (
                    <div className="mt-4">
                        <label className="block mb-2">Select Action:</label>
                        <select
                            value={assessmentAction}
                            onChange={handleAssessmentActionChange}
                            className="border border-gray-300 rounded p-2"
                        >
                            <option value="new">Import New Standard</option>
                            <option value="overwrite">
                                Overwrite Existing Standard
                            </option>
                        </select>
                    </div>
                )}
                {importType === 'assessment-standard' &&
                    assessmentAction === 'new' && (
                        <div className="mt-4">
                            <label className="block mb-2">Standard Name:</label>
                            <input
                                type="text"
                                {...register('standardName', {
                                    required: true,
                                })}
                                className="border border-gray-300 rounded p-2 mb-4"
                            />
                            {errors.standardName && (
                                <span className="text-red-500">
                                    This field is required
                                </span>
                            )}
                            <label className="block mb-2">
                                Standard Version:
                            </label>
                            <input
                                type="text"
                                {...register('standardVersion', {
                                    required: true,
                                    pattern: {
                                        value: /^V\d+(\.\d+)?$/,
                                        message:
                                            'Version must start with "V" followed by a decimal number',
                                    },
                                })}
                                className="border border-gray-300 rounded p-2 mb-4"
                            />
                            {errors.standardVersion && (
                                <span className="text-red-500">
                                    {errors.standardVersion.message}
                                </span>
                            )}
                            <label className="block mb-2">
                                Upload Standard File (Excel only):
                            </label>
                            <Controller
                                name="standardFile"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls"
                                        onChange={(e) =>
                                            field.onChange(e.target.files?.[0])
                                        }
                                        className="border border-gray-300 rounded p-2 mb-4"
                                    />
                                )}
                            />
                            {errors.standardFile && (
                                <span className="text-red-500">
                                    This field is required
                                </span>
                            )}
                        </div>
                    )}
                <div className="mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded p-2"
                    >
                        Execute Import
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ImportData
