import {
  Badge,
  Button,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react"

import { useCountFriendRequestToMe } from "modules/friend/services/countFriendRequestToMe"

import FriendRequestModal from "./FriendRequestModal"

export default function FriendRequestList() {
  const countFriendRequestToMe = useCountFriendRequestToMe()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <div className="mb-2">
      <Badge
        size="lg"
        content={countFriendRequestToMe.data}
        color="danger"
        isInvisible={!countFriendRequestToMe.data}
        classNames={{
          base: "w-full",
        }}
      >
        <Button
          variant="bordered"
          color="primary"
          size="lg"
          fullWidth
          onClick={onOpen}
        >
          Friend requests
        </Button>
      </Badge>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <FriendRequestModal
            countFriendRequestToMe={countFriendRequestToMe.data}
          />
        </ModalContent>
      </Modal>
    </div>
  )
}
