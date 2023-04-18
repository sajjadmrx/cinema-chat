import http from "@/config/http"

type signupUser = { username: string; email: string; password: string }

export const signUpUser = async (user: signupUser) => {
  try {
    const { data } = await http.post("/auth/login", user)
    return { success: true, token: data.data }
  } catch (err) {
    return { success: false, error: err }
  }
}
