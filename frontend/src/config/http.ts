import axios from "axios"

const getToken = () =>
  localStorage.getItem("token") ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUxNjUxMjM1NTc2MiwiaWF0IjoxNjgyNjE4NDYxLCJleHAiOjE2ODMyMjMyNjF9.-IZrEe_dc6867eRFVaziDKYUrgYyoNnhXUTbmp5iM2o"

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
