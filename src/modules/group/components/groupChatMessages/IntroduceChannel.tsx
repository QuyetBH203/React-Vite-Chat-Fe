import { Avatar, Divider } from "@nextui-org/react"
import { GetGroupChannelResponse } from "modules/group/services/getGroup"
import { FaHashtag } from "react-icons/fa6"

interface Props {
  groupChannel: GetGroupChannelResponse
}

export default function IntroduceChannel({ groupChannel }: Props) {
  return (
    <div className="flex flex-col space-y-2 py-14 mx-4">
      <Avatar
        showFallback
        fallback={<FaHashtag className="w-10 h-10 text-white" />}
        className="bg-zinc-600 min-w-[68px] min-h-[68px]"
      />
      <div className="font-bold text-3xl break-all">
        Welcome to #{groupChannel.name}!
      </div>
      <div className="text-zinc-500 pb-4 break-all">
        This is the beginning of the #{groupChannel.name} channel.
      </div>
      <Divider />
    </div>
  )
}
