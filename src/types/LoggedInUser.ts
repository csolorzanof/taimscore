export type LoggedInUser = {
    userId: number
    email: string
    name?: string
    pictureUrl?: string
    locale?: string
    familyName?: string
    givenName?: string
    authProviderId: number
    tenantId: number
}
