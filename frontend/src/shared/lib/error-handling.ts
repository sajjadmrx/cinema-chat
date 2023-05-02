import axios from "axios"
import { messages } from "../../constants/messages.constant"

export function errorHandling(error: any, defaultErrorMessage = "NETWORK_ERROR"): string {
  if (axios.isAxiosError(error)) {
    const serverErrorMessage = error.response?.data.message
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (serverErrorMessage && messages[serverErrorMessage]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return messages[serverErrorMessage]
    }
    return defaultErrorMessage
  }
  return defaultErrorMessage
}
