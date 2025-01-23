import {
  Avatar,
  Button,
  ModalBody,
  ModalHeader,
  Spinner,
} from "@nextui-org/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Empty from "components/common/Empty"
import { nav } from "constants/nav"
import { acceptFriendRequest } from "modules/friend/services/acceptFriendRequest"
import { cancelFriendRequest } from "modules/friend/services/cancelFriendRequest"
import { useGetFriendRequestToMeList } from "modules/friend/services/getFriendRequestToMeList"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useInView } from "react-intersection-observer"
import { Link } from "react-router-dom"
import { UserProfile } from "types/user"

interface Props {
  countFriendRequestToMe?: number
}

export default function FriendRequestModal({ countFriendRequestToMe }: Props) {
  const { ref, inView } = useInView()
  const friendRequestToMeList = useGetFriendRequestToMeList({ take: 10 })

  useEffect(() => {
    if (inView && friendRequestToMeList.hasNextPage)
      friendRequestToMeList.fetchNextPage()
  }, [inView, friendRequestToMeList])

  return (
    <>
      <ModalHeader>Friend requests</ModalHeader>
      <ModalBody>
        {friendRequestToMeList.data?.pages.map((page) =>
          page.data.map((item) => (
            <FriendRequestRow
              key={item.userId}
              data={item}
              refetch={friendRequestToMeList.refetch}
            />
          )),
        )}
        {countFriendRequestToMe !== undefined && !countFriendRequestToMe && (
          <Empty text="No friend requests" />
        )}
        <div ref={ref}></div>
        {friendRequestToMeList.isLoading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
      </ModalBody>
    </>
  )
}

interface FriendRequestRowProps {
  data: UserProfile
  refetch(): void
}

function FriendRequestRow({ data, refetch }: FriendRequestRowProps) {
  const queryClient = useQueryClient()
  const accept = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess() {
      toast.success(`Accepted friend request from '${data.fullName}'`)
      queryClient.invalidateQueries({
        queryKey: ["countFriendRequestToMe"],
      })
      queryClient.refetchQueries({ queryKey: ["getFriendRequestToMeList"] })
      queryClient.refetchQueries({ queryKey: ["getFriend"] })
      queryClient.refetchQueries({ queryKey: ["getFriendList"] })
      refetch()
    },
  })
  const cancel = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess() {
      toast.success(`Canceled friend request from '${data.fullName}'`)
      queryClient.invalidateQueries({
        queryKey: ["countFriendRequestToMe"],
      })
      queryClient.refetchQueries({ queryKey: ["getFriendRequestToMeList"] })
      queryClient.refetchQueries({ queryKey: ["getFriend"] })
      refetch()
    },
  })

  return (
    <div
      className="p-2 flex justify-between items-center hover:bg-slate-100 rounded-lg transition-all"
      key={data.userId}
    >
      <Link to={`${nav.DIRECT_MESSAGE}/${data.userId}`}>
        <div className="flex items-center gap-2">
          <Avatar name={data.fullName} />
          <div className="font-medium">{data.fullName}</div>
        </div>
      </Link>
      <div className="flex items-center gap-1">
        <Button
          color="primary"
          isLoading={accept.isPending}
          isDisabled={cancel.isPending}
          onClick={() => accept.mutate(data.userId)}
        >
          Accept
        </Button>
        <Button
          variant="light"
          color="danger"
          isLoading={cancel.isPending}
          isDisabled={accept.isPending}
          onClick={() => cancel.mutate(data.userId)}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
