import * as authService from "../services/auth.service"

export const isAuthenticated = async () => {
  const token = localStorage.getItem("token")
  if (!token) return false

  const res = await authService.getCurrentUser()
  if (res.success) return res.user
  return false
}