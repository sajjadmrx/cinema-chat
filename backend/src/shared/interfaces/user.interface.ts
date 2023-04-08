import { User as _User, Prisma, UserPermission as _UserPermission } from "@prisma/client";
import { Room } from "./room.interface";

export interface User extends _User {
}

export interface UserCraeteInput extends Prisma.UserCreateInput {
}

export interface UserUpdateInput extends Prisma.UserUpdateInput {
}

export interface UserWithRooms extends User {
  Rooms: Room[];
}

export type UserPermissionType = _UserPermission;
export const UserPermission = _UserPermission;
