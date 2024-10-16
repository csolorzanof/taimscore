import { SimpleUserGroupDTO } from './UserGroupDTO'

export type UserDTO = {
    id?: number
    tenantId: number
    fullName: string
    email: string
    isTenantAdmin: boolean
    createdDate: Date
    updatedDate?: Date
}

export type UserUserDTO = {
    userId: number
    groups?: SimpleUserGroupDTO[]
    groupIds: number[]
}
