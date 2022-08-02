import { Member as _Member, Prisma } from "@prisma/client"
import { Room } from 'src/shared/interfaces/room.interface';


export interface Member extends _Member { }


export interface MemberWithRoom extends Member {
    room: Room
}

export interface MemberCreateInput extends Omit<Prisma.MemberCreateInput, | "room" | "invite" | "user"> {
    roomId: number
    userId: number
    inviteId: number
}
