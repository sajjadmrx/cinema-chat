import http from "../config/http"
import { FetchRooms } from "../shared/interfaces/schemas/Room.interface"
import { ReturnFormat } from "../shared/interfaces/schemas/api.interface"
import axios from "axios"

export async function getPublicRoomsService(
  page: number,
  limit: number = 10,
): Promise<ReturnFormat<FetchRooms>> {
  try {
    const { data } = await http.get(`/rooms?page=${page}&limit=${limit}`)
    return { success: true, data: data.data }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data.message || "SERVER_ERROR"
    }
    throw "NET_ERROR"
  }
}
export async function getCurrentRoomsService(
  page: number,
  limit: number = 10,
): Promise<ReturnFormat<FetchRooms>> {
  try {
    const { data } = await http.get(`/rooms/@me?page=${page}&limit=${limit}`)
    return { success: true, data: data.data }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data.message || "SERVER_ERROR"
    }
    throw "NET_ERROR"
  }
}
