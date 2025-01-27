import { yupResolver } from "@hookform/resolvers/yup"
import { Button, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react"
import clsx from "clsx"
import Field from "components/core/field"
import Input from "components/core/field/Input"
import {
  UpdateUserProfileRequest,
  useUpdateUserProfile,
} from "modules/user/services/updateUserProfile"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { AiOutlineUser } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { useUser } from "store/user"
import { UserProfile } from "types/user"
import * as yup from "yup"

const formSchema = yup.object({
  avatarUrl: yup.string().required(),
  fullName: yup.string().trim().label("Full name").required().min(6),
  gender: yup.string().label("Gender").required(),
  phoneNumber: yup
    .string()
    .label("Phone number")
    .required()
    .min(10)
    .matches(/^[0-9]+$/, "Phone number must contain only digits"),
})

interface Props extends Partial<UserProfile> {
  onClose: () => void
}

export default function UpdateProfileModal({ onClose, ...profile }: Props) {
  const { user, setUser } = useUser()

  const navigate = useNavigate()

  const [avatarUrl, setAvatarUrl] = useState<string>(profile.avatarUrl || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const methods = useForm<Required<Omit<UpdateUserProfileRequest, "userId">>>({
    defaultValues: {
      avatarUrl:
        profile.avatarUrl || "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      fullName: profile.fullName || "",
      gender: profile.gender || "",
      phoneNumber: profile.phoneNumber || "+84",
    },
    resolver: yupResolver(formSchema),
    mode: "onChange",
  })
  const handelAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarUrl(URL.createObjectURL(file))
      methods.setValue("avatarUrl", URL.createObjectURL(file), {
        shouldDirty: true,
        shouldValidate: true,
      })
      console.log(avatarUrl)
      setAvatarFile(file)
    }
  }

  const { mutate, isPending: isPendingUpdate } = useUpdateUserProfile()

  const onSubmit = (data: UpdateUserProfileRequest) => {
    console.log(data)
    const formData = new FormData()
    if (avatarFile) {
      formData.append("avatar", avatarFile)
    }
    if (data.fullName) {
      formData.append("fullName", data.fullName)
    }
    if (data.gender) {
      formData.append("gender", data.gender)
    }
    if (data.phoneNumber) {
      formData.append("phoneNumber", data.phoneNumber)
    }

    mutate(formData, {
      onSuccess: (data) => {
        setUser({ ...user, profile: data })
        toast.success("Profile updated successfully")
        onClose()
        if (!profile.fullName) {
          navigate("/direct-message")
        }
      },
    })
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1 ">
            Update Profile
          </ModalHeader>
          <ModalBody>
            <div className="flex justify-center">
              <div
                className={clsx(
                  "relative flex justify-center items-center w-[140px] h-[140px]",
                  "border-2 border-dashed border-primary rounded-full overflow-hidden",
                  "cursor-pointer",
                  {
                    "p-8": !avatarUrl,
                    "!border-solid border-4": avatarUrl,
                  },
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="absolute w-full h-full  cursor-pointer opacity-0"
                  onChange={handelAvatarChange}
                />
                {avatarUrl ? (
                  <div
                    style={{
                      backgroundImage: `url('${avatarUrl}')`,
                    }}
                    className={clsx(
                      "w-full h-full bg-cover bg-center bg-no-repeat",
                    )}
                  ></div>
                ) : (
                  <AiOutlineUser size={50} className="text-primary" />
                )}
              </div>
            </div>

            <div className="pt-4 [&>div+div]:pt-2">
              <Input t="input" label="Email" value={user.email} isDisabled />
              <Field name="fullName" t="input" label="Full Name" />
              <Field name="phoneNumber" t="input" label="Phone Number" />
              <Field
                name="gender"
                t="select"
                label="Gender"
                defaultSelectedKeys={
                  methods.getValues("gender")
                    ? [methods.getValues("gender")]
                    : undefined
                }
                options={[
                  { label: "Male", value: "MALE" },
                  { label: "Female", value: "FEMALE" },
                  { label: "Other", value: "OTHER" },
                ]}
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              fullWidth
              size="lg"
              type="submit"
              color="primary"
              isLoading={isPendingUpdate}
              isDisabled={
                profile.fullName
                  ? !methods.formState.isValid || !methods.formState.isDirty
                  : !methods.formState.isValid
              }
            >
              Submit
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </>
  )
}
