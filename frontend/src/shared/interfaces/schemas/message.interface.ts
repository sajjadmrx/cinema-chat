import { User } from "@interfaces/schemas/User.interface"
import { Pagination } from "@interfaces/schemas/api.interface"

export interface Message {
  id: string
  messageId: number
  authorId: number
  roomId: number
  content: string
  replyId: null
  type: string
  createdAt: Date
  updatedAt: Date
  author: {
    nickname: string
    user: Pick<User, "username">
  }
}
