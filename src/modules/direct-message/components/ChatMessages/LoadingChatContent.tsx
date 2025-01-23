import { Skeleton } from "@nextui-org/react"

export default function LoadingChatContent() {
  return (
    <div className="flex flex-col w-full space-y-3">
      <div className="flex flex-col w-full justify-end">
        <div className="grid grid-cols-[62px,1fr,15px]">
          <div></div>
          <div className="flex flex-col items-end px-3 py-2 rounded-2xl text-white space-y-1">
            <Skeleton className="rounded-lg h-8 max-w-sm w-[80vw]">
              <div className="rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className=" rounded-lg h-8 max-w-xs w-[80vw]">
              <div className="h-3 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
          <div></div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex ">
          <div className="space-y-1">
            <div className="grid grid-cols-[48px,1fr,62px]">
              <div className="flex items-end px-2">
                <Skeleton className="flex rounded-full w-8 h-8" />
              </div>
              <div className="flex flex-col px-3 py-2 rounded-2xl text-white space-y-1">
                <Skeleton className="rounded-lg h-8 max-w-sm w-[80vw]">
                  <div className="rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="rounded-lg h-8 max-w-xs w-[80vw]">
                  <div className="rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className=" rounded-lg h-8 max-w-md w-[80vw]">
                  <div className="h-3 rounded-lg bg-default-200"></div>
                </Skeleton>
              </div>

              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full justify-end">
        <div className="grid grid-cols-[62px,1fr,15px]">
          <div></div>
          <div className="flex flex-col items-end px-3 py-2 rounded-2xl text-white space-y-1">
            <Skeleton className="rounded-lg h-8 max-w-md w-[80vw]">
              <div className="rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className=" rounded-lg h-8 max-w-xs w-[80vw]">
              <div className="h-3 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
