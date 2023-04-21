import axios from "axios"

const getToken = () => localStorage.getItem("token")

const http = axios.create({
  baseURL: process.env.API_URL,
})

http.interceptors.request.use(async (config: any) => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
  }
})

export default http
