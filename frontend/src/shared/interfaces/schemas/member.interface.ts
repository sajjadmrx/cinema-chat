import { Room } from "@interfaces/schemas/Room.interface"
import { Pagination } from "@interfaces/schemas/api.interface"

export interface Member {
  id: string
  roomId: number
  userId: number
  inviteId: null
  permissions: string[]
  nickname: string
  createdAt: Date
  updatedAt: Date
}

export interface MemberWithRoom extends Member {
  room: Omit<Room, "_count">
}

export interface fetchMembers extends Pagination {
  members: Member[]
}
