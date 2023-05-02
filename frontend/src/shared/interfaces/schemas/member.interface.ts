import { Room } from "@interfaces/schemas/Room.interface"
import { Pagination } from "@interfaces/schemas/api.interface"
import { User } from "@interfaces/schemas/User.interface"

export interface Member {
  id: string
  roomId: number
  userId: number
  inviteId: null
  permissions: string[]
  nickname: string | null
  user: Pick<User, "userId" | "username">
  createdAt: Date
  updatedAt: Date
}

export interface MemberWithRoom extends Member {
  room: Omit<Room, "_count">
}

export interface FetchMembers extends Pagination {
  members: Member[]
}
