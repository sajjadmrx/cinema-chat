import { ApiResponse, ReturnFormat } from "@interfaces/schemas/api.interface"
import { Message } from "@interfaces/schemas/message.interface"
import http from "../config/http"
export async function fetchMessages(
  roomId: number,
  page: number = 1,
  limit: number = 50,
): Promise<ReturnFormat<Message[]>> {
  const { data } = await http.get<ApiResponse<Message[]>>(
    `/rooms/${roomId}/messages?page=${page}&limit=${limit}`,
  )
  return {
    data: data.data,
  }
}
