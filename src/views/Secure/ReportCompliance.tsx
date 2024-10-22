import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { ComplianceReportDTO } from '../../DTOs/ReportsDTOs'
import HispiLogo from '../../assets/hispi.png'
import { Chart } from 'react-google-charts'
import { Spinner } from '@material-tailwind/react'
import { useNavigate } from 'react-router-dom'

const ReportCompliance = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const { token } = useContext(AuthContext)
    const [loadingReport, setLoadingReport] = useState(false)
    const [complianceReport, setComplianceReport] =
        useState<ComplianceReportDTO | null>(null)

    useEffect(() => {
        const fetchReportCompliance = async () => {
            try {
                setLoadingReport(true)
                const response = await axios.get(
                    `${
                        import.meta.env.VITE_BackendURL
                    }/assessments/${id}/compliancereport`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    console.log(response.data)
                    const data: ComplianceReportDTO = response.data
                    data.pieChartData.forEach((chartData) => {
                        chartData.data.forEach((data, index) => {
                            if (index >= 1) data[1] = parseFloat(data[1])
                        })
                    })
                    setComplianceReport(data)
                } else {
                    console.error(
                        'Failed to fetch recommendations:',
                        response.statusText
                    )
                }
                setLoadingReport(false)
            } catch (error: any) {
                console.error('Error fetching recommendations:', error)
                setLoadingReport(false)
                if (error.response.status === 401) {
                    navigate('/')
                }
            }
        }

        fetchReportCompliance()
    }, [id, token])

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            {loadingReport && <Spinner color="blue" />}
            {!loadingReport && complianceReport && (
                <div className="flex flex-col items-center mx-auto">
                    <img
                        src={HispiLogo}
                        alt="HISPI Logo"
                        className="w-32 h-32"
                    />
                    <h1 className="text-2xl font-bold mb-4">
                        Compliance Report
                    </h1>
                    <h2 className="text-xl font-bold mb-4">
                        Compliance Report for Assessment
                    </h2>
                    <h2 className="text-xl font-bold mb-4">
                        {complianceReport?.assessmentName},{' '}
                        {complianceReport?.assessmentStandarName}
                    </h2>

                    <table className="mb-8">
                        <thead>
                            <tr>
                                <th className="bg-blue-700 text-white font-bold">
                                    Control Name
                                </th>
                                <th className="bg-blue-700 text-white font-bold">
                                    Non-Compliance Score
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {complianceReport?.complianceControls.map(
                                (control, index) => {
                                    return (
                                        <tr
                                            key={`control-${index}`}
                                            className="bg-blue-50"
                                        >
                                            <td className="px-2">
                                                {control.controlSection}
                                            </td>
                                            <td className="text-center">
                                                {(control.score * 100).toFixed(
                                                    2
                                                )}
                                                %
                                            </td>
                                        </tr>
                                    )
                                }
                            )}
                        </tbody>
                    </table>

                    {complianceReport?.pieChartData.map((data, index) => {
                        if (
                            data.data[1][1] === 0 &&
                            data.data[2][1] === 0 &&
                            data.data[3][1] === 0 &&
                            data.data[4][1] === 0 &&
                            data.data[5][1] === 0
                        ) {
                            return <div></div>
                        }
                        return (
                            <div
                                key={`pie-chart-${index}`}
                                className="border-r-8 border bg-gray-100 mb-8"
                            >
                                <Chart
                                    width={'500px'}
                                    height={'300px'}
                                    chartType="PieChart"
                                    loader={<div>Loading Chart</div>}
                                    data={data.data}
                                    options={{
                                        title: data.title,
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ReportCompliance
