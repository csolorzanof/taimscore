// Definition: DTO for registering a new user
export type RegisterUserDTO = {
    tenantId: number
    authProviderId: number
    email: string
    password: string
    name?: string
    pictureUrl?: string
    locale?: string
    familyName?: string
    givenName?: string
    companyName: string
    phone: string
    jobTitle: string
    requiresSecQuestion: boolean
    address1?: string
    address2?: string
    city?: string
    stateProvince?: string
    zipCode?: string
    countryId: number
    securityQuestionId?: number
    answer: string
    includeInRaffle: boolean
    isActive: boolean
    createdUserId?: number
    createdDate: Date
    updatedUserId?: number
    updatedDate?: Date
}
