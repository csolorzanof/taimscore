import HispiLogo from '../../assets/hispi.png'

const ReportBenchmark = () => {
    /*useEffect(() => {
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
    }, [id, token])*/

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            <h1 className="font-bold text-xl text-center">Benchmark Report</h1>
            <img src={HispiLogo} alt="HISPI Logo" className="w-32 h-32" />
            <p>
                This report is still under development, please check back later.
            </p>
        </div>
    )
}

export default ReportBenchmark
