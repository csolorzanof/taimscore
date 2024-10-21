export type AssessmentDTO = {
    id?: number
    tenantId: number
    assessmentStandardId: number
    assessmentProfileId: number
    assessmentName: string
    isCompleted: boolean
    isAReassessment: boolean
    overallRating: number
    top20ControlsRating: number
    createdUserId: number
    createdDate: string
    updatedUserId?: number
    updatedDate?: string
}

export type AssessmentCreateDTO = {
    tenantId: number
    createdUserId: number
    assessmentStandardId: number
    assessmentProfileId: number
    assessmentName: string
}

export type FullAssessmentDTO = {
    id?: number
    tenantId: number
    assessmentStandardId: number
    assessmentProfileId: number
    assessmentName: string
    isCompleted: boolean
    isAReassessment: boolean
    overallRating: number
    top20ControlsRating: number
    createdUserId: number
    createdDate: string
    updatedUserId?: number
    updatedDate?: string
    mappingRatings: AssessmentMappingRatingDTO[]
    controlGroups: AssessmentControlGroupDTO[]
}

export type AssessmentMappingRatingDTO = {
    id: number
    assessmentId: number
    mappingName: string
    rating: number
}

export type AssessmentControlGroupDTO = {
    id: number
    assessmentId: number
    standardControlGroupId: number
    groupName: string
    isComplete: boolean
    rating: number
    subControlGroups: AssessmentSubControlGroupDTO[]
}

export type AssessmentSubControlGroupDTO = {
    id: number
    assessmentControlGroupId: number
    standardSubControlGroupId: number
    subControlId: string
    subControlObjective: string
    isComplete: boolean
    rating: number
    questions: AssessmentQuestionDTO[]
}

export type AssessmentQuestionDTO = {
    id: number
    assessmentSubControlId: number
    standardQuestionId: number
    questionText: string
    reference: string
    recommendation: string
    top20Rating: string
    mappings: string
    responseCode: number
    responseText: string
    maturityCode: number
    maturityText: string
    evidenceText: string
    evidenceUrl?: string
    isAnswered: boolean
    rating: number
}
