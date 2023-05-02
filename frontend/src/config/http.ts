import axios from "axios"

const getToken = () => localStorage.getItem("token") || import.meta.env.VITE_TOKEN
const BASE_URL = import.meta.env.VITE_API || ""

const http = axios.create({
  baseURL: BASE_URL,
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
