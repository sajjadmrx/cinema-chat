import * as authService from "../services/auth.service"

export const isAuthenticated = async () => {
  const token = localStorage.getItem("token")
  if (!token) return false

  const res = await authService.getCurrentUserService()
  console.log(res)
  if (res.success) return res.user
  return false
}
