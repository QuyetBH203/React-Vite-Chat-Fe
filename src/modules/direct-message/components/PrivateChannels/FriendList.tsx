import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@nextui-org/react"
import clsx from "clsx"
import DialogModal from "components/common/DialogModal"
import Empty from "components/common/Empty"
import Avatar from "components/core/Avatar"
import { queryClient } from "configs/queryClient"
import { socket } from "configs/socket"
import { nav } from "constants/nav"
import { DirectCallChannelType } from "modules/direct-call/types/direct-call-channel"
import { DirectMessageParams } from "modules/direct-message/route"
import { useDeleteFriend } from "modules/friend/services/deleteFriend"
import { useGetFriendList } from "modules/friend/services/getFriend"
import SearchFriendModal from "modules/user/components/SearchFriendModal"
import { useMemo, useState } from "react"
import { toast } from "react-hot-toast"
import { HiDotsVertical } from "react-icons/hi"
import { ImPhone } from "react-icons/im"
import { IoTrashBin } from "react-icons/io5"
import { TbMessageCircle2Filled } from "react-icons/tb"
import { useNavigate, useParams } from "react-router-dom"
import { Friend } from "types/friend"
import { UserProfile } from "types/user"
import { WsEvent, WsResponse } from "types/ws"
import { handleWsError } from "utils/ws"

export default function FriendList() {
  const [friendProfile, setFriendProfile] = useState<UserProfile>()

  const disclosureSearchFriend = useDisclosure()
  const disclosureDialogDeleteFriend = useDisclosure()

  const navigate = useNavigate()
  const { id } = useParams<keyof DirectMessageParams>()
  const friendList = useGetFriendList({})
  const deleteFriend = useDeleteFriend()

  const countFriendList = useMemo(() => {
    if (!friendList.data) return undefined
    return friendList.data.pages?.[0]?.meta.total || 0
  }, [friendList.data])

  const handleRequestCall = (friend: Friend) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(() =>
        socket.emit(
          WsEvent.REQUEST_CALL,
          {
            toUserId: friend.profile.userId,
            type: DirectCallChannelType.AUDIO,
          },
          (response: WsResponse) => handleWsError(response),
        ),
      )
      .catch(() => toast.error("Can't connect to microphone device"))
  }

  const handleOpenDialogDeleteFriend = (friendProfile: UserProfile) => {
    setFriendProfile(friendProfile)
    disclosureDialogDeleteFriend.onOpen()
  }

  return (
    <div className="[&>div:hover]:bg-purple-50 [&>div:hover]:cursor-pointer">
      {friendList.data?.pages.map(
        (page) =>
          page &&
          page.data.map((user, idx) => (
            <div
              className={clsx(
                "flex justify-between items-center bg-white py-2 px-3 rounded-2xl text-sm gap-5",
                { "!bg-purple-100": id === user.profile.userId },
              )}
              onClick={() =>
                navigate(nav.DIRECT_MESSAGE + "/" + user.profile.userId)
              }
              key={idx}
            >
              <div className="flex items-center overflow-hidden">
                <div className="relative">
                  <Avatar
                    name={user.profile.fullName}
                    src={user.profile.avatarUrl}
                    size="lg"
                  />
                  {user.isOnline && (
                    <span className="absolute right-0 bottom-0 z-10 w-4 h-4 rounded-full bg-green-400"></span>
                  )}
                </div>
                <div className="flex items-center w-full flex-col pl-3 overflow-hidden">
                  <span className="max-w-full font-bold overflow-hidden overflow-ellipsis whitespace-nowrap mb-1">
                    {user.profile.fullName}
                  </span>

                  <span className="w-full text-gray-500">
                    {user.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              <Dropdown placement="right">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="md"
                    radius="full"
                    className="bg-purple-50 text-primary-500"
                  >
                    <HiDotsVertical size="20" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Dropdown menu with description">
                  <DropdownItem
                    startContent={
                      <TbMessageCircle2Filled
                        size="20"
                        className="text-primary"
                      />
                    }
                    onClick={() =>
                      navigate(`/direct-message/${user.profile.userId}`)
                    }
                  >
                    Message
                  </DropdownItem>

                  <DropdownItem
                    startContent={
                      <ImPhone size="20" className="text-primary" />
                    }
                    onClick={() => handleRequestCall(user)}
                  >
                    Start call
                  </DropdownItem>
                  <DropdownItem
                    className="text-danger"
                    color="danger"
                    startContent={<IoTrashBin size="20" />}
                    onClick={() => handleOpenDialogDeleteFriend(user.profile)}
                  >
                    Remove friend
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )),
      )}
      {countFriendList !== undefined && !countFriendList && (
        <>
          <Button
            fullWidth
            variant="light"
            className="h-full"
            onClick={disclosureSearchFriend.onOpen}
          >
            <Empty text="No data, let's make friends!" />
          </Button>

          <Modal
            hideCloseButton
            isOpen={disclosureSearchFriend.isOpen}
            onClose={disclosureSearchFriend.onClose}
            size="lg"
            className="max-h-[600px]"
          >
            <ModalContent>
              {(onClose) => <SearchFriendModal onClose={onClose} />}
            </ModalContent>
          </Modal>
        </>
      )}
      {friendList.isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!!friendProfile && (
        <>
          <Modal
            size="lg"
            isDismissable={false}
            isOpen={disclosureDialogDeleteFriend.isOpen}
            onClose={disclosureDialogDeleteFriend.onClose}
          >
            <ModalContent>
              {(onClose) => (
                <DialogModal
                  textHeader={`Remove '${friendProfile.fullName}'`}
                  body={
                    <span>
                      Are you sure you want to permanently remove{" "}
                      <strong>{friendProfile.fullName}</strong> from your
                      friends?
                    </span>
                  }
                  btnAcceptProps={{
                    children: "Remove Friend",
                    isLoading: deleteFriend.isPending,
                    onClick: () =>
                      deleteFriend.mutate(friendProfile.userId, {
                        onSuccess: () => {
                          Promise.all([
                            queryClient.refetchQueries({
                              queryKey: ["getFriendList"],
                            }),
                            queryClient.refetchQueries({
                              queryKey: ["getFriend"],
                            }),
                          ]).then(() => {
                            toast.success("Delete friends successfully")
                            onClose()
                          })
                        },
                      }),
                  }}
                  onClose={onClose}
                />
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  )
}
