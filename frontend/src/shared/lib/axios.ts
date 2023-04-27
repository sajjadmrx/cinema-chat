import axios from "axios";

const BASE_URL = "http://193.36.85.124:4000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
