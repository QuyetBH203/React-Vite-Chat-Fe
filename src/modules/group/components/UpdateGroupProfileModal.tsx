import { yupResolver } from "@hookform/resolvers/yup"
import { Button, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react"
import { AxiosResponse } from "axios"
import clsx from "clsx"
import LoadingIcon from "components/common/LoadingIcon"
import Field from "components/core/field"
import { queryClient } from "configs/queryClient"
import { accept, maxSize } from "constants/upload"
import useUpload from "hooks/useUpload"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { colors } from "styles/theme"
import * as yup from "yup"
import { GetGroupProfileResponse } from "../services/getGroup"
import { UpdateGroupRequest, useUpdateGroup } from "../services/updateGroup"

interface Props {
  onClose: () => void
  groupProfile: GetGroupProfileResponse
}

const formSchema = yup.object({
  imageUrl: yup.string().required(),
  name: yup.string().label("Group Name").required(),
})

export default function UpdateGroupProfileModal({
  onClose,
  groupProfile,
}: Props) {
  const [imageUrl, setImageUrl] = useState<string>(groupProfile.imageUrl)

  const methods = useForm<
    Required<Pick<UpdateGroupRequest, "name" | "imageUrl">>
  >({
    defaultValues: {
      name: groupProfile.name,
      imageUrl: groupProfile.imageUrl,
    },
    resolver: yupResolver(formSchema),
    mode: "onChange",
  })

  const onSuccess = (data: AxiosResponse<string>) => {
    setImageUrl(data.data)
    methods.setValue("imageUrl", data.data, {
      shouldValidate: true,
      shouldDirty: true,
    })
    return data.data
  }

  const { getRootProps, isPending: isPendingUpload } = useUpload<string>({
    url: "/upload/image",
    accept,
    maxSize,
    onSuccess,
  })

  const updateGroup = useUpdateGroup()

  const onSubmit = (data: UpdateGroupRequest) => {
    if (imageUrl) {
      updateGroup.mutate(
        { ...data, groupId: groupProfile.id, imageUrl },
        {
          onSuccess: () => {
            Promise.all([
              queryClient.refetchQueries({ queryKey: ["getGroupList"] }),
              queryClient.refetchQueries({ queryKey: ["getGroup"] }),
            ]).then(() => {
              toast.success("Update group profile success")
              onClose()
            })
          },
        },
      )

      return
    }

    updateGroup.mutate(
      { ...data, groupId: groupProfile.id },
      {
        onSuccess: () => {
          Promise.all([
            queryClient.refetchQueries({ queryKey: ["getGroupList"] }),
            queryClient.refetchQueries({ queryKey: ["getGroup"] }),
          ]).then(() => {
            toast.success("Update group profile success")
            onClose()
          })
        },
      },
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ModalHeader className="flex items-center flex-col gap-1">
          <div className="text-center">Edit Group Profile</div>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="flex justify-center">
            <div
              {...getRootProps()}
              className={clsx(
                "flex justify-center items-center w-[120px] h-[120px]",
                "border-2 border-dashed border-primary rounded-full overflow-hidden",
                "cursor-pointer",
                {
                  "p-8": !imageUrl || isPendingUpload,
                  "!border-solid border-4": imageUrl,
                },
              )}
            >
              {isPendingUpload ? (
                <LoadingIcon />
              ) : imageUrl ? (
                <div
                  style={{
                    backgroundImage: `url('${imageUrl}')`,
                  }}
                  className={clsx(
                    "w-full h-full bg-cover bg-center bg-no-repeat",
                  )}
                ></div>
              ) : (
                <AiOutlineUsergroupAdd size={40} color={colors.primary[500]} />
              )}
            </div>
          </div>

          <Field t="input" name="name" label="Group Name" />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            isLoading={updateGroup.isPending || isPendingUpload}
            isDisabled={
              !methods.formState.isValid || !methods.formState.isDirty
            }
          >
            Submit
          </Button>
        </ModalFooter>
      </form>
    </FormProvider>
  )
}
