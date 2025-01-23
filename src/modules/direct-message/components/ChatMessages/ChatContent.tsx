import LoadingIcon from "components/common/LoadingIcon"
import { useGetMessageListFromFriend } from "modules/direct-message/services/getMessage"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useUser } from "store/user"
import { MessageFromSocket } from "types/messageFromSocket"
import { UserProfile } from "types/user"
import IntroduceFriend from "./IntroduceFriend"
import MessageFromFriend from "./MessageFromFriend"
import MessageFromMe from "./MessageFromMe"

interface Props {
  directMessageChannelId: string
  messages: MessageFromSocket[]
  profile: UserProfile
  isOnline: boolean
}

export default function ChatContent({
  directMessageChannelId,
  messages,
  profile,
  isOnline,
}: Props) {
  const { user } = useUser()

  const {
    data: dataResponse,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useGetMessageListFromFriend(
    {
      directMessageChannelId,
    },
    user.id,
  )

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  return (isFetching && !isFetchingNextPage) || isLoading ? (
    <LoadingIcon size="xl" />
  ) : (
    <>
      {messages.map((message, idx) =>
        message.userId === user.id &&
        message.directMessageChannelId === directMessageChannelId ? (
          <MessageFromMe
            key={idx}
            id={`${idx}`}
            message={message.value}
            isPrevsMessageFromMe={
              messages[idx - 1] ? messages[idx - 1].userId === user.id : true
            }
            updatedAt={message.updatedAt}
          />
        ) : (
          message.userId === profile.userId &&
          message.directMessageChannelId === directMessageChannelId && (
            <MessageFromFriend
              key={idx}
              id={`${idx}`}
              message={message.value}
              profile={profile}
              isPrevsMessageFromMe={
                messages[idx - 1] ? messages[idx - 1].userId === user.id : true
              }
              updatedAt={message.updatedAt}
            />
          )
        ),
      )}
      {dataResponse?.pages.map(
        (page, pageIdx) =>
          page &&
          page.data.map((message, idx) =>
            message.userId === user.id ? (
              <MessageFromMe
                ref={
                  pageIdx === dataResponse.pages.length - 1 &&
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
              message.userId === profile.userId && (
                <MessageFromFriend
                  ref={
                    pageIdx === dataResponse.pages.length - 1 &&
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
                      dataResponse.pages[pageIdx - 1]?.data[
                        dataResponse.pages[pageIdx - 1]!.data.length - 1
                      ].userId !== user.id)
                      ? false
                      : page.data[idx - 1]
                      ? page.data[idx - 1].userId === user.id
                      : true
                  }
                  updatedAt={message.updatedAt}
                />
              )
            ),
          ),
      )}

      {isFetchingNextPage && (
        <div className="py-2">
          <LoadingIcon size="lg" />
        </div>
      )}
      {!hasNextPage && <IntroduceFriend {...profile} isOnline={isOnline} />}
    </>
  )
}
