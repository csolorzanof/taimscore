export type FullFeedbackFormDTO = {
    id?: number
    tenantId: number
    createdUserId: number
    createdDate: Date
    comment: string
    feedbackFormDetails: FeedbackFormDetailDTO[]
}

export type FeedbackFormDetailDTO = {
    id?: number
    formId: number
    sectionId: number
    sectionName?: string
    questionId: number
    questionText?: string
    rating: number
    comment: string
}
