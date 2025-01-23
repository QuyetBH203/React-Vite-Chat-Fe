import Picker from "@emoji-mart/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@nextui-org/react"
import Field from "components/core/field"
import { socket } from "configs/socket"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { GoSmiley } from "react-icons/go"
import { LuSend } from "react-icons/lu"
import { WsEvent } from "types/ws"
import { removeWhiteSpace } from "utils/removeWhiteSpace"
import * as yup from "yup"

import { EmojiObject } from "modules/direct-message/components/ChatMessages/MessageInput"
import { MessageType } from "modules/direct-message/services/sendMessage"
import { CreateGroupMessageRequest } from "modules/group/services/sendGroupMessage"

interface FormValues extends CreateGroupMessageRequest {}

interface Props {
  groupMessageChannelId: string
}

const formSchema = yup.object().shape({
  type: yup.string<MessageType>().required(),
  value: yup
    .string()
    .required()
    .transform((value) => removeWhiteSpace(value)),
})

export default function GroupMessageInput({ groupMessageChannelId }: Props) {
  const [showPicker, setShowPicker] = useState(false)

  const methods = useForm<Required<Omit<FormValues, "groupMessageChannelId">>>({
    defaultValues: {
      type: "TEXT",
      value: "",
    },
    resolver: yupResolver(formSchema),
  })

  const handleSubmit = methods.handleSubmit((data) => {
    socket.emit(WsEvent.CREATE_GROUP_MESSAGE, {
      ...data,
      groupMessageChannelId,
    })

    methods.setFocus("value")
    methods.reset()
  })

  useEffect(() => {
    methods.setFocus("value")
  }, [methods.setFocus])

  const onEmojiClick = (emojiObject: EmojiObject) => {
    methods.setValue("value", methods.getValues("value") + emojiObject.native)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 items-center w-full py-2 px-4 bg-purple-50">
          <div className="flex-1">
            <Field
              autoFocus
              name="value"
              t="hide-input-errors"
              placeholder="Write a message..."
              variant="bordered"
              endContent={
                <GoSmiley
                  size={20}
                  onClick={() => setShowPicker(true)}
                  className="text-primary-500 cursor-pointer"
                />
              }
              size="lg"
              isInvalid={false}
              errorMessage={false}
            />
            {showPicker && (
              <>
                <div className="z-50 absolute bottom-14 right-0">
                  <Picker
                    theme="light"
                    set="facebook"
                    previewPosition="none"
                    onEmojiSelect={onEmojiClick}
                  />
                </div>

                <div
                  onClick={() => {
                    setShowPicker(false)
                  }}
                  className="z-10 fixed w-full h-full top-0 right-0"
                ></div>
              </>
            )}
          </div>
          <div>
            <Button type="submit" isIconOnly color="primary" size="lg">
              <LuSend size={20} className="text-white" />
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
