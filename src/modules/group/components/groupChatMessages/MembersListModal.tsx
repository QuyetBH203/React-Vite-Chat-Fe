import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  User,
  useDisclosure,
} from "@nextui-org/react"
import DialogModal from "components/common/DialogModal"
import { queryClient } from "configs/queryClient"
import { useDeleteMember } from "modules/group/services/deleteMember"
import { useGetGroupMembersList } from "modules/group/services/getGroupMembers"
import { useTransferOwnership } from "modules/group/services/transferOwnership"
import LoadingSearchFriend from "modules/user/components/LoadingSearchFriend"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { FaCrown } from "react-icons/fa6"
import { IoTrashBin } from "react-icons/io5"
import { RiShieldStarFill } from "react-icons/ri"
import { TbMessageCircle2Filled } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import { useUser } from "store/user"
import { UserProfile } from "types/user"

interface Props {
  isOwner: boolean
  groupId: string
  onClose: () => void
}

export default function MembersListModal({ onClose, groupId, isOwner }: Props) {
  const navigate = useNavigate()

  const [member, setMember] = useState<UserProfile>()

  const disclosureDialogTransferOwnership = useDisclosure()
  const disclosureDialogDeleteMember = useDisclosure()

  const getGroupMembersList = useGetGroupMembersList({ groupId })

  const transferOwnership = useTransferOwnership()

  const deleteMember = useDeleteMember()

  const {
    user: { id },
  } = useUser()

  const onClickTransferOwnership = (userProfile: UserProfile) => {
    setMember(userProfile)
    disclosureDialogTransferOwnership.onOpen()
  }

  const onClickDeleteMember = (userProfile: UserProfile) => {
    setMember(userProfile)
    disclosureDialogDeleteMember.onOpen()
  }

  return (
    <>
      <ModalHeader className="flex justify-center">Members List</ModalHeader>
      <ModalBody className="overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {getGroupMembersList.isLoading ? (
            <LoadingSearchFriend />
          ) : !!getGroupMembersList.data &&
            getGroupMembersList.data.pages[0].data.length > 0 ? (
            getGroupMembersList.data.pages.map((page) =>
              page.data.map((user) => (
                <div
                  key={user.user.profile.userId}
                  className="flex gap-5 justify-between items-center capitalize px-4 py-2 h-fit bg-default-100 rounded-xl"
                >
                  <User
                    name={
                      <div className="relative flex items-center gap-2">
                        <div className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                          {user.user.profile.userId !== id
                            ? user.user.profile.fullName
                            : `Me (${user.user.profile.fullName})`}
                        </div>

                        {user.isOwner && (
                          <Tooltip
                            content={"Group Owner"}
                            className="relative capitalize"
                          >
                            <Button
                              isIconOnly
                              variant="light"
                              className="h-fit min-w-fit w-fit"
                            >
                              <FaCrown size={18} className="text-yellow-500" />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    }
                    description={
                      user.user.profile.gender?.toLowerCase() || "Not Yet Added"
                    }
                    avatarProps={{
                      src: user.user.profile.avatarUrl,
                      size: "lg",
                      name: user.user.profile.fullName,
                    }}
                    classNames={{
                      wrapper: "space-y-1",
                      description: "capitalize",
                    }}
                  />
                  <div className="flex gap-2">
                    {user.user.profile.userId !== id && (
                      <Tooltip content="Message" className="capitalize">
                        <Button
                          isIconOnly
                          onClick={() => {
                            navigate(
                              `/direct-message/${user.user.profile.userId}`,
                            )
                          }}
                          variant="flat"
                          color="primary"
                          radius="full"
                        >
                          <TbMessageCircle2Filled size={20} />
                        </Button>
                      </Tooltip>
                    )}
                    {isOwner && user.user.profile.userId !== id && (
                      <>
                        <Tooltip
                          content="transfer ownership"
                          className="capitalize"
                        >
                          <Button
                            isIconOnly
                            onClick={() =>
                              onClickTransferOwnership(user.user.profile)
                            }
                            variant="flat"
                            color="primary"
                            radius="full"
                          >
                            <RiShieldStarFill size={20} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete" className="capitalize">
                          <Button
                            isIconOnly
                            onClick={() =>
                              onClickDeleteMember(user.user.profile)
                            }
                            variant="flat"
                            color="danger"
                            radius="full"
                          >
                            <IoTrashBin size={20} />
                          </Button>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>
              )),
            )
          ) : (
            <div className="flex flex-col items-center">
              <div className="font-medium">No results for ""</div>
              <div className="font-thin text-gray-500">
                Try searching for something else.
              </div>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="flat" onPress={onClose}>
          Close
        </Button>
      </ModalFooter>

      {isOwner && member && (
        <>
          <Modal
            size="lg"
            isDismissable={false}
            isOpen={disclosureDialogTransferOwnership.isOpen}
            onClose={disclosureDialogTransferOwnership.onClose}
          >
            <ModalContent>
              {(onClose) => (
                <DialogModal
                  textHeader={`Transfer Ownership to '${member.fullName}'`}
                  body={
                    <span>
                      Are you sure you want to transfer ownership to{" "}
                      <strong>{member.fullName}</strong>?
                    </span>
                  }
                  btnAcceptProps={{
                    children: "Accept",
                    isLoading: transferOwnership.isPending,
                    onClick: () =>
                      transferOwnership.mutate(
                        { groupId, targetId: member.userId },
                        {
                          onSuccess: () => {
                            Promise.all([
                              queryClient.refetchQueries({
                                queryKey: ["getGroup"],
                              }),
                              queryClient.refetchQueries({
                                queryKey: ["getGroupMembersList"],
                              }),
                            ]).then(() => {
                              toast.success("Transfer Ownership successfully")
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
          <Modal
            size="lg"
            isDismissable={false}
            isOpen={disclosureDialogDeleteMember.isOpen}
            onClose={disclosureDialogDeleteMember.onClose}
          >
            <ModalContent>
              {(onClose) => (
                <DialogModal
                  textHeader={`Remove '${member.fullName}' From Your Group`}
                  body={
                    <span>
                      Are you sure you want to remove{" "}
                      <strong>{member.fullName}</strong> from your group?
                    </span>
                  }
                  btnAcceptProps={{
                    children: "Remove Member",
                    isLoading: deleteMember.isPending,
                    onClick: () =>
                      deleteMember.mutate(
                        { groupId, deleteUserId: member.userId },
                        {
                          onSuccess: () => {
                            Promise.all([
                              queryClient.refetchQueries({
                                queryKey: ["getGroup"],
                              }),
                              queryClient.refetchQueries({
                                queryKey: ["getGroupMembersList"],
                              }),
                            ]).then(() => {
                              toast.success(
                                "Delete member from your group successfully",
                              )
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
    </>
  )
}
