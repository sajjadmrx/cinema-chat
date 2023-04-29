import { useState, useEffect } from "react"
import io, { Socket } from "socket.io-client"

const useSocket = (): Socket => {
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    if (!socket) {
      const socketInstance = io(import.meta.env.VITE_WEBSOCKET, {
        transports: ["websocket"],
        auth: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      setSocket(socketInstance)
      socketInstance.on("error", (data) => {
        console.log(data)
      })

      return () => {
        //socketInstance.disconnect()
      }
    }
  }, [])
  // @ts-ignore
  return socket
}

export default useSocket
