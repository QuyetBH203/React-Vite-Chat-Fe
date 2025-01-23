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
import { socket } from "configs/socket"
import { useEffect, useMemo, useState } from "react"
import { MdCallEnd } from "react-icons/md"
import { useUser } from "store/user"
import { WsEvent } from "types/ws"
import { DirectCallChannel } from "../types/direct-call-channel"

export default function RequestCallModal() {
  const { user } = useUser()
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [isEnding, setIsEnding] = useState(false)
  const [directCallChannel, setDirectCallChannel] =
    useState<DirectCallChannel | null>(null)
  const toUserProfile = useMemo(() => {
    if (!directCallChannel) return null
    return (
      directCallChannel.users.find(
        (item) => item.user.profile.userId !== user.id,
      )?.user.profile || null
    )
  }, [user, directCallChannel])

  const cancelCall = () => {
    socket.emit(WsEvent.CANCEL_CALL)
    onClose()
  }
  const handleRequestCall = (channel: DirectCallChannel) => {
    if (channel.createdById === user.id) {
      onOpen()
      setDirectCallChannel(channel)
    }
  }
  const handleAcceptRequestCall = (channel: DirectCallChannel) => {
    if (channel.id !== directCallChannel?.id) return
    onClose()
  }
  const handleCancelCall = (channel: DirectCallChannel) => {
    if (channel.id !== directCallChannel?.id) return
    setIsEnding(true)
    setTimeout(onClose, 2000)
  }

  useEffect(() => {
    socket.on(WsEvent.REQUEST_CALL, handleRequestCall)
    socket.on(WsEvent.ACCEPT_REQUEST_CALL, handleAcceptRequestCall)
    socket.on(WsEvent.CANCEL_CALL, handleCancelCall)

    return () => {
      socket.off(WsEvent.REQUEST_CALL, handleRequestCall)
      socket.off(WsEvent.ACCEPT_REQUEST_CALL, handleAcceptRequestCall)
      socket.off(WsEvent.CANCEL_CALL, handleCancelCall)
    }
  }, [
    onOpen,
    onClose,
    handleRequestCall,
    handleAcceptRequestCall,
    handleCancelCall,
  ])
  useEffect(() => {
    if (!isOpen) {
      setIsEnding(false)
      setDirectCallChannel(null)
    }
  }, [isOpen, setIsEnding, setDirectCallChannel])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="sm"
      isDismissable={false}
      hideCloseButton
    >
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center">
            <Avatar size="lg" src={toUserProfile?.avatarUrl} />
            <div className="mt-4 font-bold text-xl">
              {toUserProfile?.fullName || "‎"}
            </div>
            <div className="text-gray-500">
              {isEnding ? "Did not answer" : "Calling..."}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="mt-6 justify-center">
          <Button
            isIconOnly
            color="danger"
            size="lg"
            radius="full"
            onClick={cancelCall}
          >
            <MdCallEnd size="26" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
