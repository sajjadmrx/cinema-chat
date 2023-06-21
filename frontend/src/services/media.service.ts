import { ReturnFormat } from "@interfaces/schemas/api.interface"
import { User } from "@interfaces/schemas/User.interface"
import http from "../config/http"

export async function fetchMedia(
  page: number,
  limit: number,
): Promise<ReturnFormat<any[]>> {
  try {
    const { data } = await http.get(`/movies?page=${page}&limit=${limit}`)
    return { data: data.data }
  } catch (error) {
    throw error
  }
}
