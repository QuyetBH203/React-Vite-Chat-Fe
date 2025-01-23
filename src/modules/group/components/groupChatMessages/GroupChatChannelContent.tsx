import LoadingIcon from "components/common/LoadingIcon"
import { GetGroupChannelResponse } from "modules/group/services/getGroup"
import { useGetGroupMessageListChannel } from "modules/group/services/getGroupMessage"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useUser } from "store/user"
import { GroupMessageFromSocket } from "types/messageFromSocket"
import GroupMessageFromFriend from "./GroupMessageFromFriend"
import GroupMessageFromMe from "./GroupMessageFromMe"
import IntroduceChannel from "./IntroduceChannel"

interface Props {
  groupChannel: GetGroupChannelResponse
  groupId: string
  groupMessageChannelId: string
  messages: GroupMessageFromSocket[]
}

export default function GroupChatChannelContent({
  groupChannel,
  groupId,
  groupMessageChannelId,
  messages,
}: Props) {
  const { user } = useUser()

  const getGroupMessageListChannel = useGetGroupMessageListChannel({
    groupId,
    groupMessageChannelId,
  })

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      getGroupMessageListChannel.fetchNextPage()
    }
  }, [getGroupMessageListChannel.fetchNextPage, inView])

  return (getGroupMessageListChannel.isFetching &&
    !getGroupMessageListChannel.isFetchingNextPage) ||
    getGroupMessageListChannel.isLoading ? (
    <LoadingIcon size="xl" />
  ) : (
    <>
      {messages.map((message, idx) =>
        message.userId === user.id &&
        message.groupMessageChannelId === groupMessageChannelId ? (
          <GroupMessageFromMe
            key={idx}
            id={`${idx}`}
            message={message.value}
            isPrevsMessageFromMe={
              messages[idx - 1] ? messages[idx - 1].userId === user.id : true
            }
            updatedAt={message.updatedAt}
          />
        ) : (
          <GroupMessageFromFriend
            key={idx}
            id={`${idx}`}
            message={message.value}
            profile={message.user.profile}
            isPrevsMessageFromMe={
              messages[idx - 1] ? messages[idx - 1].userId === user.id : true
            }
            isPrevsMessageOtherFriend={
              messages[idx - 1] &&
              messages[idx - 1].userId !== user.id &&
              messages[idx - 1].userId !== message.userId
            }
            updatedAt={message.updatedAt}
          />
        ),
      )}
      {getGroupMessageListChannel.data?.pages.map(
        (page, pageIdx) =>
          page &&
          page.data.map((message, idx) =>
            message.userId === user.id ? (
              <GroupMessageFromMe
                ref={
                  pageIdx ===
                    getGroupMessageListChannel.data.pages.length - 1 &&
                  idx >= Math.ceil(page.data.length * 0.6)
                    ? ref
                    : undefined
                }
                key={message.id}
                id={message.id}
                message={message.value}
                isPrevsMessageFromMe={
                  page.data[idx - 1]
                    ? page.data[idx - 1].userId === user.id
                    : true
                }
                updatedAt={message.updatedAt}
              />
            ) : (
              <GroupMessageFromFriend
                ref={
                  pageIdx ===
                    getGroupMessageListChannel.data.pages.length - 1 &&
                  idx >= Math.ceil(page.data.length * 0.6)
                    ? ref
                    : undefined
                }
                key={message.id}
                id={message.id}
                message={message.value}
                profile={message.user.profile}
                isPrevsMessageFromMe={
                  (idx === 0 &&
                    messages.length > 0 &&
                    messages[messages.length - 1].userId !== user.id) ||
                  (idx === 0 &&
                    pageIdx > 0 &&
                    getGroupMessageListChannel.data.pages[pageIdx - 1]?.data[
                      getGroupMessageListChannel.data.pages[pageIdx - 1]!.data
                        .length - 1
                    ].userId !== user.id)
                    ? false
                    : page.data[idx - 1]
                    ? page.data[idx - 1].userId === user.id
                    : true
                }
                isPrevsMessageOtherFriend={
                  idx === 0 &&
                  pageIdx > 0 &&
                  getGroupMessageListChannel.data.pages[pageIdx - 1]?.data[
                    getGroupMessageListChannel.data.pages[pageIdx - 1]!.data
                      .length - 1
                  ].userId !== message.userId
                    ? true
                    : page.data[idx - 1] &&
                      page.data[idx - 1].userId !== message.userId
                }
                updatedAt={message.updatedAt}
              />
            ),
          ),
      )}

      {getGroupMessageListChannel.isFetchingNextPage && (
        <div className="py-2">
          <LoadingIcon size="lg" />
        </div>
      )}
      {!getGroupMessageListChannel.hasNextPage && (
        <IntroduceChannel groupChannel={groupChannel} />
      )}
    </>
  )
}
