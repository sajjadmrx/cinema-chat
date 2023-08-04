import http from "../config/http"
import { FetchRooms, InviteCode, Room } from "@interfaces/schemas/Room.interface"
import { ApiResponse, ReturnFormat } from "@interfaces/schemas/api.interface"
import axios from "axios"

const messages = {
  INVALID_ROOM: "اتاق نامعتبر است",
}
export async function getPublicRoomsService(
  page: number,
  limit: number = 10,
): Promise<ReturnFormat<FetchRooms>> {
  try {
    const { data } = await http.get(`/rooms?page=${page}&limit=${limit}`)
    return { data: data.data }
  } catch (error) {
    throw error
  }
}
export async function getCurrentRoomsService(
  page: number,
  limit: number = 10,
): Promise<ReturnFormat<FetchRooms>> {
  try {
    const { data } = await http.get(`/rooms/@me?page=${page}&limit=${limit}`)
    return { data: data.data }
  } catch (error) {
    throw error
  }
}

export async function createRoomService(
  roomData: Pick<Room, "name" | "isPublic" | "avatar">,
): Promise<Room> {
  try {
    const { data } = await http.post<Room>("/rooms", roomData)
    return data
  } catch (e) {
    throw e
  }
}

export async function createRoomInvite(input: {
  roomId: string
  max_use: number
  isForEver: boolean
}): Promise<ApiResponse<InviteCode>> {
  try {
    const { data } = await http.post<ApiResponse<InviteCode>>(
      `/invites/${input.roomId}`,
      {
        ...input,
        expires_at: new Date(),
      },
    )
    return data
  } catch (e) {
    throw e
  }
}
function handleError(error: any, defaultErrorMessage = "NETWORK_ERROR"): string {
  if (axios.isAxiosError(error)) {
    const serverErrorMessage = error.response?.data.message
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (serverErrorMessage && messages[serverErrorMessage]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return messages[serverErrorMessage]
    }
    return defaultErrorMessage
  }
  return defaultErrorMessage
}
