export type AssessmentProfileDTO = {
    id?: number
    tenantId: number
    profileName: string
    orgSizeId: number
    orgSizeDescription: string
    industryGroupId: number
    industryGroupName: string
    revLevelId: number
    revLevelDescription: string
    countryId: number
    countryName: string
    assessmentStandardId: number
    assessmentStandardName: string
    createdUserId: number
    createdDate: Date
    updatedUserId?: number
    updatedDate?: Date
    assessmentProfileProcessOwners: ProcessOwnerDTO[]
}

export type ProcessOwnerDTO = {
    standardControlGroupId: number
    standardControlGroupName?: string
    standardControlGroupObjective?: string
    ownerName: string
    ownerEmail: string
    ownerTelephone: string
}
