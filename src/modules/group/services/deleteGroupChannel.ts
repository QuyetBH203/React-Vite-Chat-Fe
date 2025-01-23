import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"

export interface TransferOwnershipRequest {
  groupId: string
  groupMessageChannelId: string
}

export function deleteGroupChannel({
  groupId,
  groupMessageChannelId,
}: TransferOwnershipRequest) {
  return api.delete(
    `/group-message-channel/${groupId}/${groupMessageChannelId}`,
  )
}
export function useDeleteGroupChannel() {
  return useMutation({
    mutationFn: deleteGroupChannel,
  })
}
