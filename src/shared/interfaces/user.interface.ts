import { User as _User, Prisma } from '@prisma/client';

export interface User extends _User { }
export interface UserCraeteInput extends Prisma.UserCreateInput { }
export interface UserUpdateInput extends Prisma.UserUpdateInput { }
