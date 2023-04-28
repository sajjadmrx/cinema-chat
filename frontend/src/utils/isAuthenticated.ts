import { getCurrentUserService } from "../services/user.service"
import { User } from "@interfaces/schemas/User.interface"

export const isAuthenticated = async (): Promise<User | null> => {
  const token = localStorage.getItem("token")
  if (!token) return null
  try {
    const { data: user } = await getCurrentUserService()
    return user
  } catch (e) {
    return null
  }
}
