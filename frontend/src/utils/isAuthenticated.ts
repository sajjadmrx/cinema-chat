import { getCurrentUserService } from "../services/user.service"

export const isAuthenticated = async () => {
  const token = localStorage.getItem("token")
  if (!token) return false
  try {
    const { data: user } = await getCurrentUserService()
    return user
  } catch (e) {
    return false
  }
}
