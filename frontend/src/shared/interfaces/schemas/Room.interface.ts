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
export interface Pagination {
  totalRooms: number
  totalPages: number
  nextPage: number
}
export interface FetchRooms extends Pagination {
  rooms: Array<Room>
}
export interface RoomCount {
  members: number
}
