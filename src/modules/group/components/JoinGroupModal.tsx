import { yupResolver } from "@hookform/resolvers/yup"
import { Button, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react"
import Field from "components/core/field"
import { queryClient } from "configs/queryClient"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { AcceptInviteRequest, useAcceptInvite } from "../services/acceptInvite"

const regexInviteCode = /[A-Za-z0-9]+/i

interface Props {
  onClose: () => void
}

const formSchema = yup.object({
  inviteCode: yup
    .string()
    .label("Invite Code")
    .required()
    .test({
      test: (value) => {
        if (value.match(regexInviteCode)) return true
        return false
      },
      message: "Invite code link is invalid",
    }),
})

export default function JoinGroupModal({ onClose }: Props) {
  const navigate = useNavigate()
  const acceptInvite = useAcceptInvite()

  const methods = useForm<AcceptInviteRequest>({
    defaultValues: {
      inviteCode: "",
    },
    resolver: yupResolver(formSchema),
    mode: "onChange",
  })

  const onSubmit = ({ inviteCode }: AcceptInviteRequest) => {
    acceptInvite.mutate(
      { inviteCode },
      {
        onSuccess: (data) => {
          queryClient
            .refetchQueries({
              queryKey: ["getGroupList"],
            })
            .then(() => {
              navigate(`/group/${data.groupId}`)
              toast.success("Join group successfully")
            })
        },
      },
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ModalHeader className="flex flex-col gap-1 justify-center items-center">
          <span className="text-2xl">Join a Group</span>
          <span className="text-xs text-zinc-500">
            Enter an invite below to join an existing group
          </span>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            <div className="uppercase font-semibold">Invite link</div>
            <Field
              autoFocus
              t="input"
              name="inviteCode"
              placeholder="w7hClAWkNJ"
              color="primary"
              className="text-black"
              size="lg"
            />
          </div>
          <div className="space-y-2">
            <div className="uppercase font-semibold">
              Invites should look like
            </div>
            <div className="flex flex-col text-sm text-zinc-500">
              <div>w7hClAWkNJ</div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            isLoading={acceptInvite.isPending}
            isDisabled={!methods.formState.isDirty}
          >
            Join Group
          </Button>
        </ModalFooter>
      </form>
    </FormProvider>
  )
}
