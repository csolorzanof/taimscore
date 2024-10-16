import { SimpleUserGroupDTO } from './UserGroupDTO'

export type InviteDTO = {
    id?: number
    tenantId: number
    tenantName: string
    email: string
    createdUserId: number
    inviterName: string
    groupIds: number[]
    groups: SimpleUserGroupDTO[]
}
