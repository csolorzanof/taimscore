import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { MaturityReportDTO } from '../../DTOs/ReportsDTOs'
import HispiLogo from '../../assets/hispi.png'
import { Spinner } from '@material-tailwind/react'
import { useNavigate } from 'react-router-dom'
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartData,
    CategoryScale,
    LinearScale,
    Title,
} from 'chart.js'
import { Radar, Line } from 'react-chartjs-2'

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    Title
)

const ReportMaturity = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const { token } = useContext(AuthContext)
    const [loadingReport, setLoadingReport] = useState(false)
    const [maturityReport, setMaturityReport] =
        useState<MaturityReportDTO | null>(null)
    const [chartData, setChartData] = useState<ChartData<'radar'> | null>(null)
    const [lineData, setLineData] = useState<ChartData<'line'> | null>(null)

    useEffect(() => {
        const fetchScoreReport = async () => {
            try {
                setLoadingReport(true)
                const response = await axios.get(
                    `${
                        import.meta.env.VITE_BackendURL
                    }/assessments/${id}/maturityreport`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    console.log(response.data)
                    const data: MaturityReportDTO = response.data
                    const tmpChartData: ChartData<'radar'> = {
                        labels: data.controlGroupRatings.map(
                            (control) => control.controlGroupName
                        ),
                        datasets: [
                            {
                                label: 'Actual Maturity Score',
                                data: data.controlGroupRatings.map(
                                    (control) => control.value
                                ),
                                backgroundColor: 'blue',
                                borderColor: 'blue',
                                fill: false,
                                borderWidth: 1,
                                pointBorderColor: 'orange',
                                pointBackgroundColor: 'orange',
                            },
                            {
                                label: 'Needed Maturity Score for Certification',
                                data: data.controlGroupRatings.map(() => 3.5),
                                fill: false,
                                borderColor: 'yellow',
                                backgroundColor: 'yellow',
                                pointBorderColor: 'green',
                                pointBackgroundColor: 'green',
                            },
                        ],
                    }

                    const tmpLineData: ChartData<'line'> = {
                        labels: data.controlGroupRatings.map(
                            (control) => control.controlGroupName
                        ),
                        datasets: [
                            {
                                label: 'Actual Maturity Score',
                                data: data.controlGroupRatings.map(
                                    (control) => control.value
                                ),
                                backgroundColor: 'blue',
                                borderColor: 'blue',
                                fill: false,
                                borderWidth: 1,
                                pointBorderColor: 'orange',
                                pointBackgroundColor: 'orange',
                            },
                        ],
                    }
                    setChartData(tmpChartData)
                    setLineData(tmpLineData)
                    setMaturityReport(data)
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

        fetchScoreReport()
    }, [id, token])

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            {loadingReport && <Spinner color="blue" />}
            {!loadingReport && maturityReport && (
                <div className="flex flex-col items-center mx-auto">
                    <img
                        src={HispiLogo}
                        alt="HISPI Logo"
                        className="w-32 h-32"
                    />
                    <h1 className="text-2xl font-bold mb-4">Maturity Report</h1>
                    <h2 className="text-xl font-bold mb-4">for Assessment</h2>
                    <h2 className="text-xl font-bold mb-4">
                        {maturityReport?.assessmentName},{' '}
                        {maturityReport?.assessmentStandarName}
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
                            {maturityReport?.complianceControls.map(
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

                    {chartData && (
                        <div className="mx-auto flex flex-col w-136 border rounded-md border-black p-8">
                            <h2 className="text-lg font-bold mb-4 text-center">
                                Actual vs Needed Maturity Score for
                                Certification for{' '}
                                {maturityReport?.assessmentName}
                            </h2>
                            <Radar
                                data={chartData}
                                options={{
                                    scales: {
                                        r: {
                                            min: 0,
                                            max: 5,
                                            ticks: {
                                                stepSize: 1,
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}

                    {lineData && (
                        <div className="mx-auto flex flex-col w-136 border rounded-md border-black p-8 mt-8">
                            <h2 className="text-lg font-bold mb-4 text-center">
                                Actual Maturity Score for{' '}
                                {maturityReport?.assessmentName}
                            </h2>
                            <Line
                                data={lineData}
                                options={{
                                    scales: {
                                        y: {
                                            min: 0,
                                            max: 5,
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ReportMaturity
