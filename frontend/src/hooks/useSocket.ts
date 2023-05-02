import { useState, useEffect, useRef } from "react"
import io, { Socket } from "socket.io-client"

const useSocket = (): Socket => {
  const socketRef = useRef<Socket>()

  useEffect(() => {
    if (!socketRef.current || socketRef.current.disconnected) {
      const socketInstance = io(import.meta.env.VITE_WEBSOCKET, {
        transports: ["websocket"],
        auth: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        rejectUnauthorized: true,
      })
      socketRef.current = socketInstance
      socketInstance.on("error", (data) => {
        console.log(data)
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  // @ts-ignore
  return socketRef.current
}

export default useSocket
