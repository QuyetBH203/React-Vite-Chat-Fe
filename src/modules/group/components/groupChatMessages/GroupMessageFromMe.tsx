import clsx from "clsx"
import Tooltip from "components/core/Tooltip"
import { LegacyRef, forwardRef } from "react"

interface Props {
  id: string
  message: string
  isPrevsMessageFromMe: boolean
  updatedAt: string
}

const GroupMessageFromMe = forwardRef(
  (
    { message, isPrevsMessageFromMe, updatedAt }: Props,
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
        className={clsx(
          "flex w-full justify-end",
          isPrevsMessageFromMe ? "mb-1" : "mb-3",
        )}
      >
        <div className="grid grid-cols-[62px,1fr,15px]">
          <div></div>
          <Tooltip placement="left" content={time}>
            <div className="px-3 py-2 bg-primary-500 rounded-2xl text-white max-w-[45vw] break-words">
              {message}
            </div>
          </Tooltip>
          <div></div>
        </div>
      </div>
    )
  },
)

export default GroupMessageFromMe
