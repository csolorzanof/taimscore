import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { RatingsReportDTO } from '../../DTOs/ReportsDTOs'
import HispiLogo from '../../assets/hispi.png'
import { Chart } from 'react-google-charts'
import { Spinner } from '@material-tailwind/react'
import { useNavigate } from 'react-router-dom'

const ReportScore = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const { token } = useContext(AuthContext)
    const [loadingReport, setLoadingReport] = useState(false)
    const [ratingsReport, setRatingsReport] = useState<RatingsReportDTO | null>(
        null
    )
    const [scoreColor, setScoreColor] = useState('red')

    useEffect(() => {
        const fetchScoreReport = async () => {
            try {
                setLoadingReport(true)
                const response = await axios.get(
                    `${
                        import.meta.env.VITE_BackendURL
                    }/assessments/${id}/ratingreport`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    console.log(response.data)
                    const data: RatingsReportDTO = response.data
                    if (data.ratingScore >= 850) {
                        data.ratingValue = 5
                    } else if (data.ratingScore >= 751) {
                        data.ratingValue = 4.5
                    } else if (data.ratingScore >= 601) {
                        data.ratingValue = 3.5
                    } else if (data.ratingScore >= 401) {
                        data.ratingValue = 2.5
                    } else if (data.ratingScore >= 201) {
                        data.ratingValue = 1.5
                    } else {
                        data.ratingValue = 0.5
                    }
                    setRatingsReport(data)
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

    useEffect(() => {
        if (ratingsReport) {
            if (ratingsReport.ratingScore >= 850) {
                setScoreColor('darkgreen')
            } else if (ratingsReport.ratingScore >= 751) {
                setScoreColor('green')
            } else if (ratingsReport.ratingScore >= 601) {
                setScoreColor('yellowgreen')
            } else if (ratingsReport.ratingScore >= 401) {
                setScoreColor('yellow')
            } else if (ratingsReport.ratingScore >= 201) {
                setScoreColor('orange')
            } else {
                setScoreColor('red')
            }
        }
    }, [ratingsReport])

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            {loadingReport && <Spinner color="blue" />}
            {!loadingReport && ratingsReport && (
                <div className="flex flex-col items-center mx-auto">
                    <img
                        src={HispiLogo}
                        alt="HISPI Logo"
                        className="w-32 h-32"
                    />
                    <h1 className="text-2xl font-bold mb-4">Score Report</h1>
                    <h2 className="text-xl font-bold mb-4">for Assessment</h2>
                    <h2 className="text-xl font-bold mb-4">
                        {ratingsReport?.assessmentName},{' '}
                        {ratingsReport?.assessmentStandarName}
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
                            {ratingsReport?.complianceControls.map(
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

                    <table>
                        <thead>
                            <tr>
                                <th className="bg-blue-700 text-white font-bold border p-2 w-36">
                                    Score
                                </th>
                                <th className="bg-blue-700 text-white font-bold border p-2">
                                    Maturity Level
                                </th>
                                <th className="bg-blue-700 text-white font-bold border p-2">
                                    Maturity Description
                                </th>
                                <th className="bg-blue-700 text-white font-bold border p-2">
                                    Incident Probability
                                </th>
                                <th className="bg-blue-700 text-white font-bold border p-2">
                                    Color Code
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-blue-200">
                                <td className="p-2 text-center border">
                                    {'>'} 850
                                </td>
                                <td className="p-2 text-center border">5</td>
                                <td className="p-2 text-center border">
                                    Optimized Score
                                </td>
                                <td className="p-2 text-center border">
                                    Very Low
                                </td>
                                <td
                                    className="p-2 text-center border"
                                    style={{ backgroundColor: 'darkgreen' }}
                                >
                                    &nbsp;
                                </td>
                            </tr>
                            <tr className="bg-white">
                                <td className="p-2 text-center border">
                                    751 - 850
                                </td>
                                <td className="p-2 text-center border">
                                    4 - 5
                                </td>
                                <td className="p-2 text-center border">
                                    Excellent Score
                                </td>
                                <td className="p-2 text-center border">Low</td>
                                <td
                                    className="p-2 text-center border"
                                    style={{ backgroundColor: 'green' }}
                                >
                                    &nbsp;
                                </td>
                            </tr>
                            <tr className="bg-blue-200">
                                <td className="p-2 text-center border">
                                    601 - 750
                                </td>
                                <td className="p-2 text-center border">
                                    3 - 4
                                </td>
                                <td className="p-2 text-center border">
                                    Great Score
                                </td>
                                <td className="p-2 text-center border">
                                    Medium Low
                                </td>
                                <td
                                    className="p-2 text-center border"
                                    style={{ backgroundColor: 'yellowgreen' }}
                                >
                                    &nbsp;
                                </td>
                            </tr>
                            <tr className="bg-white">
                                <td className="p-2 text-center border">
                                    401 - 600
                                </td>
                                <td className="p-2 text-center border">
                                    2 - 3
                                </td>
                                <td className="p-2 text-center border">
                                    Fair Score
                                </td>
                                <td className="p-2 text-center border">
                                    Medium
                                </td>
                                <td
                                    className="p-2 text-center border"
                                    style={{ backgroundColor: 'yellow' }}
                                >
                                    &nbsp;
                                </td>
                            </tr>
                            <tr className="bg-blue-200">
                                <td className="p-2 text-center border">
                                    201 - 400
                                </td>
                                <td className="p-2 text-center border">
                                    1 - 2
                                </td>
                                <td className="p-2 text-center border">
                                    Poor Score
                                </td>
                                <td className="p-2 text-center border">High</td>
                                <td
                                    className="p-2 text-center border"
                                    style={{ backgroundColor: 'orange' }}
                                >
                                    &nbsp;
                                </td>
                            </tr>
                            <tr className="bg-white">
                                <td className="p-2 text-center border">
                                    0 - 200
                                </td>
                                <td className="p-2 text-center border">
                                    0 - 1
                                </td>
                                <td className="p-2 text-center border">
                                    Very Poor Score
                                </td>
                                <td className="p-2 text-center border">
                                    Very High
                                </td>
                                <td
                                    className="p-2 text-center border"
                                    style={{ backgroundColor: 'red' }}
                                >
                                    &nbsp;
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex flex-row items-center">
                        <span className="-rotate-90">Score</span>
                        <Chart
                            chartType="ComboChart"
                            width={400}
                            height={400}
                            data={[
                                [
                                    'Label',
                                    'Your Score',
                                    'Max Score',
                                    'Max Level',
                                ],
                                [
                                    'Score',
                                    ratingsReport.ratingScore,
                                    1000 - ratingsReport.ratingScore,
                                    5,
                                ],
                            ]}
                            options={{
                                interactivity: false,
                                tooltip: { trigger: 'none' },
                                chartArea: { left: 50, right: 50 },
                                isStacked: true,
                                legend: {
                                    position: 'none',
                                },
                                series: {
                                    0: {
                                        targetAxisIndex: 0,
                                        title: 'Score',
                                        color: scoreColor,
                                    },
                                    1: { targetAxisIndex: 0, color: 'grey' },
                                    2: { targetAxisIndex: 1, type: 'line' },
                                },
                                seriesType: 'bars',
                                vAxis: {
                                    0: {
                                        title: 'Score',
                                    },
                                    1: {
                                        title: 'Level',
                                        baseline: 0,
                                        minValue: 0,
                                        maxValue: 5,
                                    },
                                },
                            }}
                        />
                        <span className="-rotate-90 w-10">Maturity Level</span>
                    </div>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th className="border p-2">Max Score</th>
                                    <th className="border p-2">Your Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td
                                        className="border p-2 text-center"
                                        style={{
                                            backgroundColor: 'darkgreen',
                                            color: 'white',
                                        }}
                                    >
                                        1000
                                    </td>
                                    <td
                                        className="border p-2 text-center"
                                        style={{
                                            backgroundColor: scoreColor,
                                        }}
                                    >
                                        {ratingsReport.ratingScore}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReportScore
