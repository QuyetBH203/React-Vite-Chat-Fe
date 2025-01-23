import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react"
import DialogModal from "components/common/DialogModal"
import { queryClient } from "configs/queryClient"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineUser } from "react-icons/ai"
import {
  MdAddToPhotos,
  MdGroups2,
  MdKeyboardArrowDown,
  MdOutlineClose,
  MdOutlineGroupRemove,
  MdPersonAddAlt,
} from "react-icons/md"
import { TbEdit } from "react-icons/tb"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { useUser } from "store/user"
import AddMembersModal from "../components/AddMembersModal"
import UpdateGroupProfileModal from "../components/UpdateGroupProfileModal"
import AddChatChannelModal from "../components/channels/AddChatChannelModal"
import ChatChannels from "../components/channels/ChatChannels"
import MembersListModal from "../components/groupChatMessages/MembersListModal"
import { GroupMessageParams } from "../route"
import { useGetGroupProfile } from "../services/getGroup"
import { useLeaveGroup } from "../services/leaveGroup"

export default function DirectGroupMessages() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const { user } = useUser()

  const navigate = useNavigate()

  const { groupId = "" } = useParams<keyof GroupMessageParams>()

  const disclosureAddMembers = useDisclosure()
  const disclosureAddChatChannel = useDisclosure()
  const disclosureUpdateGroup = useDisclosure()
  const disclosureGetMembersList = useDisclosure()
  const disclosureLeaveGroup = useDisclosure()

  const groupProfile = useGetGroupProfile({ groupId })
  const leaveGroup = useLeaveGroup()

  const handleOpenChange = (isOpen: boolean) => {
    setShowDropdown(isOpen)
  }

  useEffect(() => {
    if (groupProfile.isError) {
      navigate("/")
      return
    }
  }, [groupProfile.isError, navigate])

  return (
    <div className="grid grid-cols-[22rem,1fr]">
      {!!groupProfile.data && (
        <>
          <div className="h-screen px-4 pb-5 border-x-2 space-y-4 overflow-y-auto">
            <Dropdown
              placement="bottom-end"
              onOpenChange={handleOpenChange}
              className="py-2 space-y-2"
            >
              <DropdownTrigger>
                <Button
                  fullWidth
                  className="h-fit py-2 mt-2 text-black"
                  variant="light"
                  endContent={
                    showDropdown ? (
                      <MdOutlineClose size={20} />
                    ) : (
                      <MdKeyboardArrowDown size={20} />
                    )
                  }
                >
                  <div className="w-full flex flex-col items-start space-y-1 text-black overflow-hidden">
                    <div className="text-start w-full font-semibold text-xl overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {groupProfile.data.name}
                    </div>
                    <div className="flex items-end space-x-1 text-sm">
                      <span>
                        <AiOutlineUser size={22} />
                      </span>
                      <span>{groupProfile.data._count.users} members</span>
                    </div>
                  </div>
                </Button>
              </DropdownTrigger>

              {groupProfile.data.ownerId === user.id ? (
                <DropdownMenu aria-label="Dynamic Actions">
                  <DropdownItem
                    endContent={<TbEdit size={18} />}
                    onClick={disclosureUpdateGroup.onOpen}
                  >
                    Edit Group Profile
                  </DropdownItem>

                  <DropdownItem
                    endContent={<MdAddToPhotos size={18} />}
                    onClick={disclosureAddChatChannel.onOpen}
                  >
                    Add Chat Channel
                  </DropdownItem>

                  <DropdownItem
                    endContent={<MdPersonAddAlt size={18} />}
                    onClick={disclosureAddMembers.onOpen}
                  >
                    Add Members
                  </DropdownItem>
                  <DropdownItem
                    endContent={<MdGroups2 size={18} />}
                    onClick={disclosureGetMembersList.onOpen}
                  >
                    Members List
                  </DropdownItem>
                  {groupProfile.data._count.users === 1 ? (
                    <DropdownItem
                      color="danger"
                      endContent={<MdOutlineGroupRemove size={18} />}
                      onClick={disclosureLeaveGroup.onOpen}
                      className="text-danger"
                    >
                      Leave Group
                    </DropdownItem>
                  ) : (
                    <DropdownItem className="hidden"></DropdownItem>
                  )}
                </DropdownMenu>
              ) : (
                <DropdownMenu aria-label="Dynamic Actions">
                  <DropdownItem
                    endContent={<MdGroups2 size={18} />}
                    onClick={disclosureGetMembersList.onOpen}
                  >
                    Members List
                  </DropdownItem>
                  <DropdownItem
                    color="danger"
                    endContent={<MdOutlineGroupRemove size={18} />}
                    onClick={disclosureLeaveGroup.onOpen}
                    className="text-danger"
                  >
                    Leave Group
                  </DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>

            {groupProfile.data.ownerId === user.id && (
              <>
                <Modal
                  size="md"
                  className="max-h-[600px]"
                  isOpen={disclosureAddMembers.isOpen}
                  onOpenChange={disclosureAddMembers.onOpenChange}
                >
                  <ModalContent>
                    {(onClose) => (
                      <AddMembersModal
                        onClose={onClose}
                        groupProfile={groupProfile.data!}
                      />
                    )}
                  </ModalContent>
                </Modal>
                <Modal
                  size="lg"
                  isOpen={disclosureAddChatChannel.isOpen}
                  onClose={disclosureAddChatChannel.onClose}
                >
                  <ModalContent>
                    {(onClose) => (
                      <AddChatChannelModal
                        onClose={onClose}
                        groupId={groupProfile.data!.id}
                      />
                    )}
                  </ModalContent>
                </Modal>
                <Modal
                  size="lg"
                  isOpen={disclosureUpdateGroup.isOpen}
                  onClose={disclosureUpdateGroup.onClose}
                >
                  <ModalContent>
                    {(onClose) => (
                      <UpdateGroupProfileModal
                        onClose={onClose}
                        groupProfile={groupProfile.data!}
                      />
                    )}
                  </ModalContent>
                </Modal>
              </>
            )}

            {(groupProfile.data.ownerId !== user.id ||
              (groupProfile.data.ownerId === user.id &&
                groupProfile.data._count.users === 1)) && (
              <Modal
                size="lg"
                isDismissable={false}
                isOpen={disclosureLeaveGroup.isOpen}
                onClose={disclosureLeaveGroup.onClose}
              >
                <ModalContent>
                  {(onClose) => (
                    <DialogModal
                      textHeader={`Leave group '${groupProfile.data.name}'`}
                      body={
                        <span>
                          Are you sure you want to leave group{" "}
                          <strong>{groupProfile.data.name}</strong>
                        </span>
                      }
                      btnAcceptProps={{
                        children: "Leave Group",
                        isLoading: leaveGroup.isPending,
                        onClick: () =>
                          leaveGroup.mutate(
                            { groupId: groupProfile.data.id },
                            {
                              onSuccess: () => {
                                queryClient
                                  .refetchQueries({
                                    queryKey: ["getGroup"],
                                  })
                                  .then(() => {
                                    toast.success(
                                      `Leave group ${groupProfile.data.name} successfully`,
                                    )
                                    onClose()
                                    navigate("/")
                                  })
                              },
                            },
                          ),
                      }}
                      onClose={onClose}
                    />
                  )}
                </ModalContent>
              </Modal>
            )}

            <Modal
              isOpen={disclosureGetMembersList.isOpen}
              onClose={disclosureGetMembersList.onClose}
              size="xl"
              className="max-h-[600px]"
            >
              <ModalContent>
                {(onClose) => (
                  <MembersListModal
                    onClose={onClose}
                    groupId={groupProfile.data!.id}
                    isOwner={groupProfile.data!.ownerId === user.id}
                  />
                )}
              </ModalContent>
            </Modal>

            <Divider />

            <ChatChannels
              groupId={groupProfile.data.id}
              isOwner={groupProfile.data.ownerId === user.id}
            />
          </div>
          <Outlet context={groupProfile.data} />
        </>
      )}
    </div>
  )
}
