import { Room as _Room } from '@prisma/client';

export interface Room extends _Room { }


export interface RoomCreateInput extends Omit<Room, 'createdAt' | 'updatedAt' | 'id' | 'roomId'> { }

export interface RoomUpdateInput extends Partial<RoomCreateInput> { }