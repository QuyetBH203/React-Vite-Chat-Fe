import { Spinner } from "@nextui-org/react"
import clsx from "clsx"
import Empty from "components/common/Empty"
import Avatar from "components/core/Avatar"
import { DirectMessageParams } from "modules/direct-message/route"
import { useGetDirectMessage } from "modules/direct-message/services/getMessage"
import moment from "moment"
import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { useUser } from "store/user"

export default function Chat() {
  const { id } = useParams<keyof DirectMessageParams>()
  const { user } = useUser()
  const directMessageChannelList = useGetDirectMessage({})

  const countdirectMessageChannelList = useMemo(() => {
    if (!directMessageChannelList.data) return undefined
    return directMessageChannelList.data.pages?.[0]?.meta.total || 0
  }, [directMessageChannelList.data])

  return (
    <div>
      {directMessageChannelList.data?.pages.map(
        (page) =>
          page &&
          page.data.map((item) => (
            <Link
              to={item.user.profile.userId}
              key={item.user.profile.userId}
              className={clsx(
                "flex items-center py-2 px-3 rounded-2xl text-sm hover:bg-purple-50 cursor-pointer",
                { "!bg-purple-100": id === item.user.profile.userId },
              )}
            >
              <div className="relative">
                <Avatar
                  name={item.user.profile.fullName}
                  src={item.user.profile.avatarUrl}
                  size="lg"
                />
              </div>
              <div className="flex w-full gap-5 items-center justify-between overflow-hidden">
                <div className="flex w-full flex-col pl-3 overflow-hidden">
                  <div className="flex w-full gap-3 items-end justify-between overflow-hidden mb-1">
                    <span className="font-bold overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {item.user.profile.fullName}
                    </span>
                  </div>

                  <div className="flex w-full gap-3 items-end justify-between">
                    <span className="text-gray-500 overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {item.lastMessage.userId === user.id && "Bạn: "}
                      {item.lastMessage.value}
                    </span>
                  </div>
                </div>
                <div className={clsx("text-xs text-gray-500")}>
                  {moment(item.lastMessage.createdAt).format("HH:mm")}
                </div>
              </div>
            </Link>
          )),
      )}
      {countdirectMessageChannelList !== undefined &&
        !countdirectMessageChannelList && (
          <Empty text="No data, let's chat with friends!" />
        )}
      {directMessageChannelList.isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  )
}
