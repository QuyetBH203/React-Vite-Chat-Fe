import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react"
import DialogModal from "components/common/DialogModal"
import { queryClient } from "configs/queryClient"
import { toast } from "react-hot-toast"
import { IoIosArrowForward, IoIosLogOut } from "react-icons/io"
import {
  MdAddToPhotos,
  MdGroups2,
  MdOutlineGroupRemove,
  MdPersonAddAlt,
} from "react-icons/md"
import { TbEdit } from "react-icons/tb"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useUser } from "store/user"
import AddMembersModal from "../components/AddMembersModal"
import UpdateGroupProfileModal from "../components/UpdateGroupProfileModal"
import AddChatChannelModal from "../components/channels/AddChatChannelModal"
import MembersListModal from "../components/groupChatMessages/MembersListModal"
import { GetGroupProfileResponse } from "../services/getGroup"
import { useLeaveGroup } from "../services/leaveGroup"

export default function HomeGroupChannel() {
  const {
    user: { id },
  } = useUser()

  const navigate = useNavigate()

  const groupProfile = useOutletContext<GetGroupProfileResponse>()

  const disclosureAddMembers = useDisclosure()
  const disclosureAddChatChannel = useDisclosure()
  const disclosureUpdateGroup = useDisclosure()
  const disclosureGetMembersList = useDisclosure()
  const disclosureLeaveGroup = useDisclosure()

  const leaveGroup = useLeaveGroup()

  return (
    <div className="relative flex justify-center items-center">
      <div className="absolute flex justify-center items-center max-w-3xl w-full h-full max-h-[750px] bg-[url('/images/sign-in-bg.jpg')] bg-cover bg-center"></div>
      <div className="flex justify-center items-center w-full backdrop-blur-xl h-full">
        <div className="flex flex-col items-center max-w-xl w-full space-y-6 p-8 rounded-3xl overflow-y-auto max-h-screen">
          <div className="w-full text-3xl font-bold break-words">
            Welcome to {groupProfile.name}
          </div>
          <div className="w-full space-y-2">
            {id === groupProfile.ownerId && (
              <>
                <Button
                  variant="flat"
                  color="default"
                  onClick={disclosureUpdateGroup.onOpen}
                  fullWidth
                  startContent={<TbEdit size={25} />}
                  endContent={<IoIosArrowForward size={20} />}
                  className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
                >
                  <div className="flex-1 flex justify-start mx-2 font-semibold">
                    Edit Group Profile
                  </div>
                </Button>
                <Button
                  variant="flat"
                  color="default"
                  onClick={disclosureAddChatChannel.onOpen}
                  fullWidth
                  startContent={<MdAddToPhotos size={25} />}
                  endContent={<IoIosArrowForward size={20} />}
                  className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
                >
                  <div className="flex-1 flex justify-start mx-2 font-semibold">
                    Add Chat Channel
                  </div>
                </Button>
                <Button
                  variant="flat"
                  color="default"
                  onClick={disclosureAddMembers.onOpen}
                  fullWidth
                  startContent={<MdPersonAddAlt size={25} />}
                  endContent={<IoIosArrowForward size={20} />}
                  className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
                >
                  <div className="flex-1 flex justify-start mx-2 font-semibold">
                    Add Members
                  </div>
                </Button>

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
                        groupProfile={groupProfile}
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
                        groupId={groupProfile.id}
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
                        groupProfile={groupProfile}
                      />
                    )}
                  </ModalContent>
                </Modal>
              </>
            )}
            <Button
              variant="flat"
              color="default"
              onClick={disclosureGetMembersList.onOpen}
              fullWidth
              startContent={<MdGroups2 size={25} />}
              endContent={<IoIosArrowForward size={20} />}
              className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
            >
              <div className="flex-1 flex justify-start mx-2 font-semibold">
                Members list
              </div>
            </Button>
            {id === groupProfile.ownerId && groupProfile._count.users === 1 && (
              <Button
                variant="flat"
                color="danger"
                onClick={disclosureLeaveGroup.onOpen}
                fullWidth
                startContent={<MdOutlineGroupRemove size={25} />}
                endContent={<IoIosLogOut size={20} />}
                className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl"
              >
                <div className="flex-1 flex justify-start mx-2 font-semibold">
                  Leave group
                </div>
              </Button>
            )}
            {id !== groupProfile.ownerId && (
              <Button
                variant="flat"
                color="danger"
                onClick={disclosureLeaveGroup.onOpen}
                fullWidth
                startContent={<MdOutlineGroupRemove size={25} />}
                endContent={<IoIosLogOut size={20} />}
                className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl"
              >
                <div className="flex-1 flex justify-start mx-2 font-semibold">
                  Leave group
                </div>
              </Button>
            )}

            {(id !== groupProfile.ownerId ||
              (id === groupProfile.ownerId &&
                groupProfile._count.users === 1)) && (
              <Modal
                size="lg"
                isDismissable={false}
                isOpen={disclosureLeaveGroup.isOpen}
                onClose={disclosureLeaveGroup.onClose}
              >
                <ModalContent>
                  {(onClose) => (
                    <DialogModal
                      textHeader={`Leave group '${groupProfile.name}'`}
                      body={
                        <span>
                          Are you sure you want to leave group{" "}
                          <strong>{groupProfile.name}</strong>
                        </span>
                      }
                      btnAcceptProps={{
                        children: "Leave Group",
                        isLoading: leaveGroup.isPending,
                        onClick: () =>
                          leaveGroup.mutate(
                            { groupId: groupProfile.id },
                            {
                              onSuccess: () => {
                                queryClient.removeQueries({
                                  queryKey: ["getGroup", groupProfile.id],
                                })
                                queryClient
                                  .refetchQueries({
                                    queryKey: ["getGroup"],
                                  })
                                  .then(() => {
                                    toast.success(
                                      `Leave group ${groupProfile.name} successfully`,
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
                    isOwner={id === groupProfile.ownerId}
                    onClose={onClose}
                    groupId={groupProfile.id}
                  />
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}
