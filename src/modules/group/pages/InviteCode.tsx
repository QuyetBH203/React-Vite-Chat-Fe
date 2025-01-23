import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"
import Empty from "components/common/Empty"
import LoadingPage from "components/common/LoadingPage"
import { toast } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { JoinGroupParams } from "../route"
import { useAcceptInvite } from "../services/acceptInvite"
import { useGetGroupProfileByInviteCode } from "../services/getGroupProfileByInviteCode"

export default function InviteCode() {
  const { inviteCode = "" } = useParams<keyof JoinGroupParams>()

  const getGroupProfileByInviteCode = useGetGroupProfileByInviteCode({
    inviteCode,
  })

  const navigate = useNavigate()

  const acceptInvite = useAcceptInvite()

  const { isOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
  })

  const handleAccept = () => {
    if (inviteCode) {
      acceptInvite.mutate(
        { inviteCode },
        {
          onSuccess: (data) => {
            navigate(`/group/${data.groupId}`)
            toast.success("Join group successfully")
          },
          onError: () => {
            navigate("/")
          },
        },
      )
    }
  }

  return (
    <div className="max-h-screen h-screen flex justify-center items-center">
      <img
        src="/images/sign-in-bg.jpg"
        alt=""
        className="w-full max-w-md md:max-w-3xl"
      />

      <Modal
        size={!getGroupProfileByInviteCode.data ? "md" : "lg"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton
        className="max-h-96 min-h-[200px]"
      >
        <ModalContent>
          {(onClose) =>
            getGroupProfileByInviteCode.status === "pending" ? (
              <LoadingPage />
            ) : getGroupProfileByInviteCode.data ? (
              <>
                <ModalHeader className="flex flex-col gap-2 items-center pb-0">
                  <Avatar
                    src={
                      getGroupProfileByInviteCode.data.owner.profile.avatarUrl
                    }
                    className="w-20 h-20"
                  />
                  <div className="text-zinc-500 font-normal">
                    {getGroupProfileByInviteCode.data.owner.profile.fullName}{" "}
                    invited you to join
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="flex gap-2 items-center justify-center">
                    <Avatar
                      src={getGroupProfileByInviteCode.data.imageUrl}
                      radius="lg"
                      size="md"
                    />
                    <div className="text-xl font-semibold text-zinc-700">
                      {getGroupProfileByInviteCode.data.name}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onPress={handleAccept}
                    fullWidth
                    isLoading={acceptInvite.isPending}
                  >
                    Accept Invite
                  </Button>
                </ModalFooter>
              </>
            ) : (
              <>
                <ModalBody>
                  <div className="flex flex-1 items-center h-full justify-center">
                    <Empty text={"An error occurred, please try again"} />
                  </div>
                </ModalBody>
                <ModalFooter className="pt-0">
                  <Button
                    color="primary"
                    onClick={() => {
                      onClose()
                      navigate("/")
                    }}
                    fullWidth
                    isLoading={acceptInvite.isPending}
                  >
                    Return Home Page
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </div>
  )
}
