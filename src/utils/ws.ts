import toast from "react-hot-toast"
import { WsResponse } from "types/ws"

export function handleWsError(response: WsResponse) {
  if (response.status === "error")
    toast.error(response.error || "An error has occurred")
}
