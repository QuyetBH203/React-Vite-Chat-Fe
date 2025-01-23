import { queryClient } from "configs/queryClient"
import { socket } from "configs/socket"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { WsEvent } from "types/ws"
import PrivateChannels from "../components/PrivateChannels"

export default function DirectMessages() {
  const handleIncomingMessage = () => {
    queryClient.refetchQueries({
      queryKey: ["get-direct-message"],
    })
  }

  useEffect(() => {
    socket.on(WsEvent.CREATE_DIRECT_MESSAGE, handleIncomingMessage)

    return () => {
      socket.off(WsEvent.CREATE_DIRECT_MESSAGE, handleIncomingMessage)
    }
  }, [handleIncomingMessage])

  return (
    <div className="grid grid-cols-[22rem,1fr] ">
      <PrivateChannels />
      <Outlet />
    </div>
  )
}
