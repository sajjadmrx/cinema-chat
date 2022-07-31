import { Prisma, Room as _Room } from '@prisma/client';

export interface Room extends _Room { }


export interface RoomCreateInput extends Omit<Prisma.RoomCreateInput, 'roomId' | 'owner'> {
    ownerId: number
}
export interface RoomUpdateInput extends Prisma.RoomUpdateInput { }