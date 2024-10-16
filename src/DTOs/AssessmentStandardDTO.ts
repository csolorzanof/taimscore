export type AssessmentStandardDTO = {
    id?: number
    tenantId: number
    standardName: string
    standardVersion: string
    isActive: boolean
    createdUserId: number
    createdDate: string
    updatedUserId?: number
    updatedDate?: string
}

export type AssessmentStandardControlGroupDTO = {
    id?: number
    assessmentStandardId: number
    tenantId: number
    groupId: string
    groupName: string
    groupObjective: string
    createdUserId: number
    createdDate: string
    updatedUserId?: number
    updatedDate?: string
}
