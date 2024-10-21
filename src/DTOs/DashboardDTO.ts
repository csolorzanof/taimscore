import { AssessmentDTO } from './FullAssessmentDTO'

export type DashboardDTO = {
    totalUsers: number
    totalGroups: number
    totalAssessmentProfiles: number
    completedAssessments: number
    inProgressAssessments: number
    totalAssessments: number
    assessments: AssessmentDTO[]
}
