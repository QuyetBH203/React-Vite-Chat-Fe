import {
  Badge,
  Button,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react"
import UpdateProfileModal from "modules/auth/components/UpdateProfileModal"
import CreateGroupModal from "modules/group/components/CreateGroupModal"
import JoinGroupModal from "modules/group/components/JoinGroupModal"
import SearchFriendModal from "modules/user/components/SearchFriendModal"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { IoIosArrowForward } from "react-icons/io"
import { RiUserSearchLine, RiUserSharedLine } from "react-icons/ri"
import { TbUserEdit } from "react-icons/tb"
import { useUser } from "store/user"
import { useCountFriendRequestToMe } from "../../friend/services/countFriendRequestToMe"
import FriendRequestModal from "../components/PrivateChannels/FriendRequestModal"

export default function Home() {
  const {
    user: { profile },
  } = useUser()

  const disclosureSearchFriend = useDisclosure()
  const disclosureCreateGroup = useDisclosure()
  const disclosureFriendRequest = useDisclosure()
  const countFriendRequestToMe = useCountFriendRequestToMe()
  const disclosureJoinGroup = useDisclosure()
  const disclosureUpdateProfile = useDisclosure()

  return (
    <div className="relative flex justify-center items-center">
      <div className="absolute flex justify-center items-center max-w-3xl w-full h-full max-h-[750px] bg-[url('/images/sign-in-bg.jpg')] bg-cover bg-center"></div>
      <div className="flex justify-center items-center w-full backdrop-blur-xl h-full">
        <div className="flex flex-col items-center max-w-xl w-full space-y-6 p-8 rounded-3xl overflow-y-auto max-h-screen">
          <div className="text-3xl font-bold ">Welcome to IdeaM</div>
          <div className="w-full space-y-2">
            <Button
              variant="flat"
              color="default"
              onPress={disclosureCreateGroup.onOpen}
              fullWidth
              startContent={<AiOutlineUsergroupAdd size={25} />}
              endContent={<IoIosArrowForward size={20} />}
              className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
            >
              <div className="flex-1 flex justify-start mx-2 font-semibold">
                Create your group
              </div>
            </Button>
            <Button
              variant="flat"
              color="default"
              onPress={disclosureJoinGroup.onOpen}
              fullWidth
              startContent={<AiOutlineUsergroupAdd size={25} />}
              endContent={<IoIosArrowForward size={20} />}
              className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
            >
              <div className="flex-1 flex justify-start mx-2 font-semibold">
                Join group
              </div>
            </Button>
            <Button
              variant="flat"
              color="default"
              onPress={disclosureSearchFriend.onOpen}
              fullWidth
              startContent={<RiUserSearchLine size={25} />}
              endContent={<IoIosArrowForward size={20} />}
              className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
            >
              <div className="flex-1 flex justify-start mx-2 font-semibold">
                Search for friends
              </div>
            </Button>
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
                variant="flat"
                color="default"
                onClick={disclosureFriendRequest.onOpen}
                fullWidth
                startContent={<RiUserSharedLine size={25} />}
                endContent={<IoIosArrowForward size={20} />}
                className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
              >
                <div className="flex-1 flex justify-start mx-2 font-semibold">
                  Friend request
                </div>
              </Button>
            </Badge>
            <Button
              variant="flat"
              color="default"
              onPress={disclosureUpdateProfile.onOpen}
              fullWidth
              startContent={<TbUserEdit size={25} />}
              endContent={<IoIosArrowForward size={20} />}
              className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
            >
              <div className="flex-1 flex justify-start mx-2 font-semibold">
                Update profile
              </div>
            </Button>
          </div>
        </div>
      </div>
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
      <Modal
        isOpen={disclosureJoinGroup.isOpen}
        onClose={disclosureJoinGroup.onClose}
        size="lg"
        className="max-h-[600px]"
      >
        <ModalContent>
          {(onClose) => <JoinGroupModal onClose={onClose} />}
        </ModalContent>
      </Modal>
      <Modal
        size="lg"
        isOpen={disclosureCreateGroup.isOpen}
        onClose={disclosureCreateGroup.onClose}
      >
        <ModalContent>
          {(onClose) => <CreateGroupModal onClose={onClose} />}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={disclosureFriendRequest.isOpen}
        onOpenChange={disclosureFriendRequest.onOpenChange}
      >
        <ModalContent>
          <FriendRequestModal
            countFriendRequestToMe={countFriendRequestToMe.data}
          />
        </ModalContent>
      </Modal>
      <Modal
        isOpen={disclosureUpdateProfile.isOpen}
        onOpenChange={disclosureUpdateProfile.onOpenChange}
        size="lg"
        classNames={{
          wrapper: "max-sm:items-center",
        }}
      >
        <ModalContent>
          {(onClose) => <UpdateProfileModal onClose={onClose} {...profile} />}
        </ModalContent>
      </Modal>
    </div>
  )
}
