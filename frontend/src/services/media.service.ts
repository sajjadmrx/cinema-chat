import { ReturnFormat } from "@interfaces/schemas/api.interface"
import { User } from "@interfaces/schemas/User.interface"
import http from "../config/http"

export async function getCurrentUserService(): Promise<ReturnFormat<User>> {
  try {
    const { data } = await http.get("/users/@me")
    return { data: data.data }
  } catch (error) {
    throw error
  }
}
