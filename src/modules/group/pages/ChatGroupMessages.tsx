import { queryClient } from "configs/queryClient"
import { socket } from "configs/socket"
import { useEffect, useState } from "react"
import { FaHashtag } from "react-icons/fa6"
import { useNavigate, useParams } from "react-router-dom"
import { GroupMessageFromSocket } from "types/messageFromSocket"
import { WsEvent } from "types/ws"
import GroupChatChannelContent from "../components/groupChatMessages/GroupChatChannelContent"
import GroupMessageInput from "../components/groupChatMessages/GroupMessageInput"
import { GroupMessageParams } from "../route"
import { useGetGroupChannel } from "../services/getGroup"

export default function ChatGroupMessages() {
  const { groupMessageChannelId = "", groupId = "" } =
    useParams<keyof GroupMessageParams>()

  const navigate = useNavigate()

  const groupChannel = useGetGroupChannel(
    { groupId, groupMessageChannelId },
    !!groupId && !!groupMessageChannelId,
  )

  const [messages, setMessages] = useState<GroupMessageFromSocket[]>([])

  const handleIncomingMessage = (message: GroupMessageFromSocket) => {
    if (groupMessageChannelId === message.groupMessageChannelId) {
      setMessages((prev) => [message, ...prev])
    }
  }

  useEffect(() => {
    socket.on(WsEvent.CREATE_GROUP_MESSAGE, handleIncomingMessage)

    return () => {
      socket.off(WsEvent.CREATE_GROUP_MESSAGE, handleIncomingMessage)
    }
  }, [groupMessageChannelId, groupId, handleIncomingMessage])

  useEffect(() => {
    setMessages([])
    queryClient.refetchQueries({
      queryKey: ["getGroupMessageListChannel"],
    })
  }, [groupId, groupMessageChannelId])

  useEffect(() => {
    if (groupChannel.isError) {
      navigate("/")
    }
  }, [groupChannel.isError, navigate])

  return (
    <div className="flex flex-col justify-between w-full max-h-screen">
      <div className="flex flex-col items-center w-full bg-gray-50 space-y-2">
        <div className="flex items-center justify-between gap-10 w-full px-6 py-2">
          <div className="flex items-center space-x-1">
            <span>
              <FaHashtag size={20} />
            </span>
            <span className="text-xl break-all">{groupChannel.data?.name}</span>
          </div>
        </div>
      </div>

      <div className="h-full bg-purple-50 pb-5 overflow-y-auto flex flex-col-reverse">
        {!!groupChannel.data?.id && !!groupChannel.data?.groupId && (
          <GroupChatChannelContent
            groupChannel={groupChannel.data}
            groupId={groupChannel.data.groupId}
            groupMessageChannelId={groupChannel.data.id}
            messages={messages}
          />
        )}
      </div>

      {groupChannel.data && (
        <GroupMessageInput groupMessageChannelId={groupChannel.data.id} />
      )}
    </div>
  )
}
