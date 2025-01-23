import clsx from "clsx"
import Avatar from "components/core/Avatar"
import Tooltip from "components/core/Tooltip"
import { LegacyRef, forwardRef } from "react"
import { UserProfile } from "types/user"

interface Props {
  id: string
  profile: UserProfile
  message: string
  isPrevsMessageFromMe: boolean
  updatedAt: string
}

const MessageFromFriend = forwardRef(
  (
    { message, profile, isPrevsMessageFromMe, updatedAt }: Props,
    ref: LegacyRef<HTMLDivElement>,
  ) => {
    const time =
      new Date(updatedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) +
      ", " +
      new Date(updatedAt).toLocaleDateString("en-US")

    return (
      <div
        ref={ref}
        className={clsx("w-full", isPrevsMessageFromMe ? "mb-3" : "mb-1")}
      >
        <div className="flex ">
          <div className="space-y-1">
            <div className="grid grid-cols-[48px,1fr,62px]">
              {isPrevsMessageFromMe ? (
                <div className="flex items-end px-2">
                  <Tooltip placement="right" content={profile.fullName}>
                    <Avatar
                      name={profile.fullName}
                      src={profile.avatarUrl}
                      size="sm"
                    />
                  </Tooltip>
                </div>
              ) : (
                <div></div>
              )}
              <Tooltip placement="right" content={time}>
                <div className="px-3 py-2 bg-white rounded-2xl max-w-[45vw] break-words">
                  {message}
                </div>
              </Tooltip>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
)
export default MessageFromFriend
