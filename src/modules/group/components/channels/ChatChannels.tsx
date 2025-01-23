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
import { queryClient } from "configs/queryClient"
import { GroupMessageParams } from "modules/group/route"
import { useDeleteGroupChannel } from "modules/group/services/deleteGroupChannel"
import {
  GetGroupChatChannelResponse,
  useGetGroupChatChannelList,
} from "modules/group/services/getGroup"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { FaHashtag } from "react-icons/fa6"
import { IoTrashBin } from "react-icons/io5"
import { MdAdd } from "react-icons/md"
import { RiSettings5Fill } from "react-icons/ri"
import { TbEdit } from "react-icons/tb"
import { useNavigate, useParams } from "react-router-dom"
import AddChatChannelModal from "./AddChatChannelModal"
import EditChatChannelModal from "./EditChatChannelModal"

interface Props {
  groupId: string
  isOwner: boolean
}

export default function ChatChannels({ groupId, isOwner }: Props) {
  const navigate = useNavigate()
  const [chatChannel, setChatChannel] = useState<GetGroupChatChannelResponse>()

  const disclosureAddChatChannel = useDisclosure()
  const disclosureEditChatChannel = useDisclosure()
  const disclosureDialogDeleteGroupChannel = useDisclosure()

  const { groupMessageChannelId } = useParams<keyof GroupMessageParams>()

  const getGroupChatChannelList = useGetGroupChatChannelList({ groupId })

  const deleteGroupChannel = useDeleteGroupChannel()

  const handleClick = (groupChatChannelId: string) => {
    navigate(groupChatChannelId)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-4 items-center justify-between pr-4">
        <span className="text-lg">Chat channels</span>
        {isOwner && (
          <>
            <Button
              isIconOnly
              variant="light"
              className="h-fit min-w-fit w-4"
              onPress={disclosureAddChatChannel.onOpen}
            >
              <MdAdd size={16} />
            </Button>

            <Modal
              size="lg"
              isOpen={disclosureAddChatChannel.isOpen}
              onClose={disclosureAddChatChannel.onClose}
            >
              <ModalContent>
                {(onClose) => (
                  <AddChatChannelModal onClose={onClose} groupId={groupId} />
                )}
              </ModalContent>
            </Modal>
          </>
        )}
      </div>
      <div>
        {getGroupChatChannelList.data ? (
          getGroupChatChannelList.data.pages.map((page) =>
            page.data.map((chatChannel) => (
              <div
                onClick={() => handleClick(chatChannel.id)}
                key={chatChannel.id}
                className={clsx(
                  "cursor-pointer rounded-lg [&:hover]:bg-purple-50 flex items-center justify-between gap-4 px-4 py-1",
                  {
                    "!bg-purple-100 ": chatChannel.id === groupMessageChannelId,
                  },
                )}
              >
                <div className="w-full flex items-center space-x-1 overflow-hidden">
                  <span>
                    <FaHashtag size={16} />
                  </span>
                  <span className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {chatChannel.name}
                  </span>
                </div>
                {isOwner && (
                  <>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          variant="light"
                          className="h-fit min-w-fit w-4 "
                        >
                          <RiSettings5Fill size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="settings">
                        <DropdownItem
                          key="edit_chat_channel"
                          endContent={<TbEdit size={18} />}
                          onClick={() => {
                            setChatChannel(chatChannel)
                            disclosureEditChatChannel.onOpen()
                          }}
                        >
                          Edit Chat Channel
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          endContent={<IoTrashBin size="18" />}
                          onClick={() => {
                            setChatChannel(chatChannel)
                            disclosureDialogDeleteGroupChannel.onOpen()
                          }}
                        >
                          Delete Channel
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </>
                )}
              </div>
            )),
          )
        ) : (
          <></>
        )}
        {chatChannel && (
          <>
            <Modal
              size="lg"
              isOpen={disclosureEditChatChannel.isOpen}
              onClose={disclosureEditChatChannel.onClose}
            >
              <ModalContent>
                {(onClose) => (
                  <EditChatChannelModal
                    onClose={onClose}
                    groupId={groupId}
                    groupChannel={chatChannel}
                  />
                )}
              </ModalContent>
            </Modal>

            <Modal
              size="lg"
              isOpen={disclosureDialogDeleteGroupChannel.isOpen}
              onClose={disclosureDialogDeleteGroupChannel.onClose}
            >
              <ModalContent>
                {(onClose) => (
                  <DialogModal
                    textHeader={`Remove Group Channel '${chatChannel.name}'`}
                    body={
                      <span>
                        Are you sure you want to permanently remove chat channel{" "}
                        <strong>{chatChannel.name}</strong> from your group?
                      </span>
                    }
                    btnAcceptProps={{
                      children: "Remove Group Channel",
                      isLoading: deleteGroupChannel.isPending,
                      onClick: () =>
                        deleteGroupChannel.mutate(
                          { groupId, groupMessageChannelId: chatChannel.id },
                          {
                            onSuccess: () => {
                              toast.success("Remove Group Channel successfully")
                              queryClient
                                .refetchQueries({
                                  queryKey: ["getGroupChatChannelList"],
                                })
                                .then(() => {
                                  navigate(`/group/${groupId}`)
                                  onClose()
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
          </>
        )}
        {getGroupChatChannelList.isLoading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  )
}
