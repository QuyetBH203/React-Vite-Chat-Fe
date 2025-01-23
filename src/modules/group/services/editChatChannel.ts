import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { ChatChannel } from "types/group"

export interface EditChatChannelRequest extends Partial<ChatChannel> {}

export interface EditChatChannelResponse extends ChatChannel {}

export async function editChatChannel({
  groupId,
  id,
  ...data
}: EditChatChannelRequest) {
  return (
    await api.patch<EditChatChannelResponse>(
      `/group-message-channel/${groupId}/${id}`,
      data,
    )
  ).data
}

export function useEditChatChannel() {
  return useMutation({
    mutationFn: editChatChannel,
  })
}
