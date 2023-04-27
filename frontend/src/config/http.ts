import axios from "axios"

const getToken = () => localStorage.getItem("token")

const http = axios.create({
  baseURL: "http://193.36.85.124:4000",
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
