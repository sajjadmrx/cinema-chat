import http from "../config/http"
import { ReturnFormat } from "@interfaces/schemas/api.interface"
import { User } from "@interfaces/schemas/User.interface"

type signupUser = { username: string; email: string; password: string }
type loginUser = { username: string; password: string }

export async function signupService(user: signupUser): Promise<ReturnFormat<string>> {
  try {
    const { data } = await http.post("/auth/signup", user)
    return { data: data.data }
  } catch (error) {
    throw error
  }
}

export async function loginService(user: loginUser): Promise<ReturnFormat<string>> {
  try {
    const { data } = await http.post("/auth/login", user)
    return { data: data.data }
  } catch (error) {
    throw error
  }
}
