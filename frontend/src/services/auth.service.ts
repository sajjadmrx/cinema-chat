import http from "@/config/http"

type signupUser = { username: string; email: string; password: string }
type loginUser = { username: string; password: string }

export const signUpUser = async (user: signupUser) => {
  try {
    const { data } = await http.post("/auth/signup", user)
    return { success: true, token: data.data }
  } catch (error) {
    return { success: false, error }
  }
}

export const logInUser = async (user: loginUser) => {
  try {
    const { data } = await http.post("/auth/login", user)
    return { success: true, token: data.data }
  } catch (error) {
    return { success: false, error }
  }
}
