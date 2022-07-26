import { User as _User } from '@prisma/client'

export interface User extends _User { }
export interface UserCraeteInput extends Omit<User, 'createdAt' | 'updatedAt' | 'id'> { }
export interface UserUpdateInput extends Partial<UserCraeteInput> { }
