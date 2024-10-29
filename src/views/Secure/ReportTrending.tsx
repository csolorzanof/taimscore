import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { RatingsReportDTO, TrendingReportDTO } from '../../DTOs/ReportsDTOs'
import HispiLogo from '../../assets/hispi.png'
import { Chart } from 'react-google-charts'
import { Spinner } from '@material-tailwind/react'
import { useNavigate } from 'react-router-dom'

const ReportTrending = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const { token } = useContext(AuthContext)
    const [loadingReport, setLoadingReport] = useState(false)
    const [trendingReport, setTrendingReport] =
        useState<TrendingReportDTO | null>(null)

    useEffect(() => {
        const fetchTrendingReport = async () => {
            try {
                setLoadingReport(true)
                const response = await axios.get(
                    `${
                        import.meta.env.VITE_BackendURL
                    }/assessments/${id}/trendingreport`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    console.log(response.data)
                    const data: TrendingReportDTO = response.data
                    setTrendingReport(data)
                } else {
                    console.error(
                        'Failed to fetch trending report:',
                        response.statusText
                    )
                }
                setLoadingReport(false)
            } catch (error: any) {
                console.error('Error fetching trending report:', error)
                setLoadingReport(false)
                if (error.response.status === 401) {
                    navigate('/')
                }
            }
        }

        fetchTrendingReport()
    }, [id, token])

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            {loadingReport && <Spinner color="blue" />}
            {!loadingReport &&
                trendingReport &&
                trendingReport.ratingsReports.length === 0 && (
                    <div className="flex flex-col items-center mx-auto">
                        <img
                            src={HispiLogo}
                            alt="HISPI Logo"
                            className="w-32 h-32"
                        />
                        <h1 className="text-2xl font-bold mb-4 text-red-400">
                            No completed assessments have been found to generate
                            a trending report
                        </h1>
                    </div>
                )}
            {!loadingReport &&
                trendingReport &&
                trendingReport.ratingsReports.length > 0 && (
                    <div className="flex flex-col items-center mx-auto">
                        <img
                            src={HispiLogo}
                            alt="HISPI Logo"
                            className="w-32 h-32"
                        />
                        <h1 className="text-2xl font-bold mb-4">
                            Trending Report
                        </h1>
                        <h2 className="text-xl font-bold mb-4">
                            for Assessment Profile
                        </h2>
                        <h2 className="text-xl font-bold mb-4">
                            {trendingReport?.assessmentProfileName}, and
                            Standard {trendingReport?.assessmentStandarName}
                        </h2>

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
                                    <td className="p-2 text-center border">
                                        5
                                    </td>
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
                                    <td className="p-2 text-center border">
                                        Low
                                    </td>
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
                                        style={{
                                            backgroundColor: 'yellowgreen',
                                        }}
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
                                    <td className="p-2 text-center border">
                                        High
                                    </td>
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
                                width={600}
                                height={400}
                                data={[
                                    [
                                        'Label',
                                        'Your Score',
                                        { role: 'style' },
                                        'Max Score',
                                        'Max Level',
                                    ],
                                    ...trendingReport.ratingsReports.map(
                                        (r, index) => {
                                            return [
                                                index + 1,
                                                r.ratingScore,
                                                r.ratingScore > 850
                                                    ? 'darkgreen'
                                                    : r.ratingScore > 751
                                                    ? 'green'
                                                    : r.ratingScore > 601
                                                    ? 'yellowgreen'
                                                    : r.ratingScore > 401
                                                    ? 'yellow'
                                                    : r.ratingScore > 201
                                                    ? 'orange'
                                                    : 'red',
                                                1000 - r.ratingScore,
                                                5,
                                            ]
                                        }
                                    ),
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
                                        },
                                        1: {
                                            targetAxisIndex: 0,
                                            color: 'lightgrey',
                                        },
                                        2: {
                                            targetAxisIndex: 1,
                                            type: 'line',
                                            color: 'transparent',
                                        },
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
                            <span className="-rotate-90 w-10">
                                Maturity Level
                            </span>
                        </div>
                        <div className="flex flex-row items-center">
                            <span className="-rotate-90">Score</span>
                            <Chart
                                chartType="ComboChart"
                                width={600}
                                height={400}
                                data={[
                                    [
                                        'Label',
                                        'Your Score',
                                        { role: 'annotation' },
                                        { role: 'style' },
                                        'Max Score',
                                        'Min Level',
                                        'Max Level',
                                    ],
                                    ...trendingReport.ratingsReports.map(
                                        (r, index) => {
                                            return [
                                                index + 1,
                                                r.ratingScore,
                                                r.ratingScore.toString(),
                                                r.ratingScore > 850
                                                    ? 'darkgreen'
                                                    : r.ratingScore > 751
                                                    ? 'green'
                                                    : r.ratingScore > 601
                                                    ? 'yellowgreen'
                                                    : r.ratingScore > 401
                                                    ? 'yellow'
                                                    : r.ratingScore > 201
                                                    ? 'orange'
                                                    : 'red',
                                                1000,
                                                0,
                                                5,
                                            ]
                                        }
                                    ),
                                ]}
                                options={{
                                    interactivity: false,
                                    tooltip: { trigger: 'none' },
                                    chartArea: { left: 50, right: 50 },
                                    pointSize: 5,
                                    pointShape: 'square',
                                    legend: {
                                        position: 'none',
                                    },
                                    series: {
                                        0: {
                                            targetAxisIndex: 0,
                                            title: 'Score',
                                        },
                                        1: {
                                            targetAxisIndex: 0,
                                            color: 'transparent',
                                        },
                                        2: {
                                            targetAxisIndex: 1,
                                            color: 'transparent',
                                        },
                                        3: {
                                            targetAxisIndex: 1,
                                            color: 'transparent',
                                        },
                                    },
                                    seriesType: 'line',
                                    vAxis: {
                                        0: {
                                            title: 'Score',
                                            baseline: 0,
                                            minValue: 0,
                                            maxValue: 1000,
                                        },
                                        1: {
                                            title: 'Level',
                                            baseline: 0,
                                            minValue: 0,
                                            maxValue: 5,
                                            color: 'transparent',
                                        },
                                    },
                                }}
                            />
                            <span className="-rotate-90 w-10">
                                Maturity Level
                            </span>
                        </div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>X-Axis Reference No</th>
                                        <th className="border p-2">
                                            Assessment Name
                                        </th>
                                        <th className="border p-2">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trendingReport.ratingsReports.map(
                                        (r: RatingsReportDTO, index) => (
                                            <tr key={index}>
                                                <td className="border p-2">
                                                    {index + 1}
                                                </td>
                                                <td className="border p-2">
                                                    {r.assessmentName}
                                                </td>
                                                <td className="border p-2">
                                                    {r.ratingScore}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default ReportTrending
