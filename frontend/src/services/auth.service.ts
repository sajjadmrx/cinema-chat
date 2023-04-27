import http from "../config/http"

type signupUser = { username: string; email: string; password: string }
type loginUser = { username: string; password: string }

export const signup = async (user: signupUser) => {
  try {
    const { data } = await http.post("/auth/signup", user)
    return { success: true, data: data.data }
  } catch (error) {
    return { success: false, error }
  }
}

export const login = async (user: loginUser) => {
  try {
    const { data } = await http.post("/auth/login", user)
    return { success: true, data: data.data }
  } catch (error) {
    return { success: false, error }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data } = await http.get("/users/@me")
    return { success: true, user: data.data }
  } catch (error) {
    return { success: false, error }
  }
}
