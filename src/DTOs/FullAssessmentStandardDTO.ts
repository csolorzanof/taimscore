export type FullAssessmentStandardDTO = {
    id?: number
    tenantId: number
    standardName: string
    standardVersion: string
    isActive: boolean
    createdUserId: number
    createdDate: Date
    updatedUserId?: number
    updatedDate?: Date
    controlGroups: ControlGroupDTO[]
}

export type ControlGroupDTO = {
    id?: number
    assessmentStandardId: number
    groupName: string
    createdUserId: number
    createdDate: Date
    updatedUserId?: number
    updatedDate?: Date
    subControlGroups: SubControlGroupDTO[]
}

export type SubControlGroupDTO = {
    id?: number
    controlGroupId: number
    description: string
    createdUserId: number
    createdDate: Date
    updatedUserId?: number
    updatedDate?: Date
    questions: QuestionsDTO[]
}

export type QuestionsDTO = {
    id: number
    assessmentStandardId: number
    tenantId: number
    groupId: number
    subGroupId: number
    questionText: string
    recommendation: string
    top20Rating: string
    mappings: string
}
