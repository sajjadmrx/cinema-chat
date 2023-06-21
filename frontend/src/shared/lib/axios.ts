/// <reference types="vite/client" />

import axios from "axios"

export const BASE_URL = import.meta.env.VITE_API
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})
export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})
