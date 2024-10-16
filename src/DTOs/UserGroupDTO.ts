export type UserGroupDTO = {
    id?: number
    tenantId: number
    groupName: string
    createdUserId: number
    createdDate: Date
    updatedUserId?: number
    updatedDate?: Date
    assessmentProfiles: UserGroupAssessmentProfileDTO[]
}

export type SimpleUserGroupDTO = {
    groupId?: number
    tenantId: number
    groupName: string
}

export type UserGroupAssessmentProfileDTO = {
    id?: number
    assessmentProfileId: number
    assessmentProfileName?: string
    createdUserId: number
    createdDate: Date
    updatedUserId?: number
    updatedDate?: Date
}

export type SimpleAssessmentProfileDTO = {
    id: number
    tenantId: number
    profileName: string
}
