import { useState, useEffect, useRef } from "react"
import io, { Socket } from "socket.io-client"

export const socket = io(import.meta.env.VITE_WEBSOCKET, {
  transports: ["websocket"],
  auth: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  rejectUnauthorized: true,
})
socket.on("error", (data) => {
  console.log(data)
})

socket.emit("test", "world", (response: any) => {
  console.log(response) // "got it"
})
