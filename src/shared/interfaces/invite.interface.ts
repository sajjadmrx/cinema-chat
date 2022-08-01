import { Invite as _Invite, Prisma } from '@prisma/client'

export interface Invite extends _Invite { }

export interface InviteCreateInput extends Omit<Prisma.InviteCreateInput, 'id' | 'room' | 'inviter' | 'inviteId' | 'uses' | 'slug'> {
    roomId: number,
    inviterId: number
}