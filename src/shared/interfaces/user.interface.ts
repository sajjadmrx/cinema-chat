import { User as _User, Prisma } from '@prisma/client';
import { Room } from './room.interface';

export interface User extends _User {}

export interface UserCraeteInput extends Prisma.UserCreateInput {}

export interface UserUpdateInput extends Prisma.UserUpdateInput {}

export interface UserWithRooms extends User {
  Rooms: Room[];
}
