import {
  Button,
  Modal,
  ModalContent,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react"
import SearchFriendModal from "modules/user/components/SearchFriendModal"
import { LuSearch } from "react-icons/lu"
import Chat from "./Chat"
import FriendList from "./FriendList"
import FriendRequestList from "./FriendRequestList"

export default function PrivateChannels() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className="h-screen px-4 pb-5 border-x-2 bg-white space-y-2 overflow-y-auto">
      <div className="sticky top-0 pt-5 pb-2 bg-white z-20 space-y-2">
        <div className="text-3xl font-bold">Chats</div>
        <Button
          variant="flat"
          color="default"
          onPress={onOpen}
          className="justify-start"
          startContent={<LuSearch size={20} />}
          fullWidth
          size="lg"
        >
          Search your friends...
        </Button>
      </div>
      <div>
        <Tabs
          variant="light"
          color="primary"
          size="lg"
          radius="full"
          classNames={{
            tabList: "rounded-none",
            tabContent: "text-black font-semibold",
            tab: "p-6 bg-gray-100 hover:text-black",
          }}
          fullWidth
        >
          <Tab key="all-chats" title="All Chats">
            <Chat />
          </Tab>
          <Tab key="friends" title="Friends">
            <div>
              <FriendRequestList />
              <FriendList />
            </div>
          </Tab>
        </Tabs>
      </div>

      <Modal
        hideCloseButton
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-lg max-h-[600px]"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => <SearchFriendModal onClose={onClose} />}
        </ModalContent>
      </Modal>
    </div>
  )
}
