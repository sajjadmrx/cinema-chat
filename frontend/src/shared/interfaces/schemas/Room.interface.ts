import { Pagination } from "@interfaces/schemas/api.interface"

export interface Room {
  id: string
  roomId: number
  ownerId: number
  name: string
  isPublic: boolean
  avatar: string
  _count: RoomCount
  createdAt: Date
  updatedAt: Date
}

export interface FetchRooms extends Pagination {
  rooms: Array<Room>
}
export interface RoomCount {
  members: number
}
export type InviteCode = string
