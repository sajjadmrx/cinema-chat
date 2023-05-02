import http from "../config/http"
import { FetchRooms } from "@interfaces/schemas/Room.interface"
import { ReturnFormat } from "@interfaces/schemas/api.interface"
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
