import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../AuthProvider' // Adjust the path as necessary
import { RecommendationDTO } from '../../DTOs/RecommendationDTO'

const RecommendationView = () => {
    const { id } = useParams<{ id: string }>()
    const { token } = useContext(AuthContext)
    const [recommendations, setRecommendations] = useState<RecommendationDTO[]>(
        []
    )
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true)
                const response = await axios.get(
                    `${
                        import.meta.env.VITE_BackendURL
                    }/assessments/recommendation/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.status === 200) {
                    setRecommendations(response.data)
                } else {
                    console.error(
                        'Failed to fetch recommendations:',
                        response.statusText
                    )
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.error('Error fetching recommendations:', error)
            }
        }

        fetchRecommendations()
    }, [id, token])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Recommendations</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Group Name</th>
                        <th className="py-2 px-4 border">Objective</th>
                        <th className="py-2 px-4 border">Weakness</th>
                        <th className="py-2 px-4 border">Recommendation</th>
                        <th className="py-2 px-4 border">
                            Related AI Incident
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {recommendations.length === 0 && (
                        <tr>
                            <td
                                colSpan={4}
                                className="py-2 px-2 border text-center"
                            >
                                No recommendations found
                            </td>
                        </tr>
                    )}
                    {recommendations.map((recommendation, index) => (
                        <tr key={index}>
                            <td className="py-2 px-2 border text-xs text-center">
                                {recommendation.controlSection}
                            </td>
                            <td className="py-2 px-2 border text-xs">
                                {recommendation.controlObjective}
                            </td>
                            <td className="py-2 px-2 border text-xs">
                                {recommendation.controlWeakness}
                            </td>
                            <td className="py-2 px-2 border text-xs">
                                {recommendation.recommendation}
                            </td>
                            <td className="py-2 px-2 border text-xs">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: recommendation.relatedAIIncident,
                                    }}
                                    className="related-ai-incident"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RecommendationView
