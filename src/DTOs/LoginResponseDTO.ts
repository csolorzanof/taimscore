export type LoginResponseDTO = {
    userId: number
    email: string
    name: string
    pictureUrl: string
    locale: string
    familyName: string
    givenName: string
    token: string
    redirectToRegister: boolean
    authProviderId: number
    tenantId: number
    inviteCode?: string
    isSaasAdmin: boolean
    isTenantAdmin: boolean
}
