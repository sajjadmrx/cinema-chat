import { createContext } from "react"

export interface SocketContext {
  isConnected: boolean
  setIsConnected: any
}
export const socketContext = createContext<SocketContext>({
  isConnected: false,
  setIsConnected: () => {},
})
