import { Divider, Modal, ModalContent, useDisclosure } from "@nextui-org/react"
import { queryClient } from "configs/queryClient"
import UpdateProfileModal from "modules/auth/components/UpdateProfileModal"
import CreateGroupModal from "modules/group/components/CreateGroupModal"
import { useGetGroupList } from "modules/group/services/getGroup"
import { TbLogout } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import { useUser } from "store/user"
import SidebarItem from "./SidebarItem"

export default function Sidebar() {
  const {
    clear,
    user: { profile },
  } = useUser()

  const disclosureUpdateProfile = useDisclosure()
  const disclosureAddGroup = useDisclosure()

  const getGetGroupList = useGetGroupList({})

  const navigate = useNavigate()

  return (
    <div className="flex flex-col justify-between bg-slate-200 py-2 max-h-screen overflow-hidden">
      <div className="space-y-2  max-h-[calc(100vh - 30px)] overflow-x-hidden overflow-y-auto pb-6">
        <SidebarItem
          label="Update Profile"
          src={profile.avatarUrl}
          handleClick={disclosureUpdateProfile.onOpen}
        />
        <SidebarItem
          label="Direct Messages"
          handleClick={() => {
            navigate(`/direct-message`)
          }}
        />
        <div className="flex justify-center">
          <Divider className="w-8" />
        </div>
        {getGetGroupList.data?.pages.map((page) =>
          page.data.map((group, idx) => (
            <SidebarItem
              handleClick={() => {
                navigate(`/group/${group.group.id}`)
              }}
              label={group.group.name}
              src={group.group.imageUrl}
              key={idx}
            />
          )),
        )}

        <SidebarItem
          label="Add Group"
          handleClick={disclosureAddGroup.onOpen}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-center">
          <Divider className="w-8" />
        </div>
        <SidebarItem
          label="Log Out"
          children={<TbLogout size={22} className="text-primary" />}
          handleClick={() => {
            queryClient.clear()
            clear()
          }}
        />
      </div>

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
      <Modal
        size="lg"
        isOpen={disclosureAddGroup.isOpen}
        onClose={disclosureAddGroup.onClose}
      >
        <ModalContent>
          {(onClose) => <CreateGroupModal onClose={onClose} />}
        </ModalContent>
      </Modal>
    </div>
  )
}
