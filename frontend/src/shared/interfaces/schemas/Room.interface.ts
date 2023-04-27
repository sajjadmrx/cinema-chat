export interface Room {
  id: string
  roomId: number
  ownerId: number
  name: string
  isPublic: boolean
  avatar: string
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
