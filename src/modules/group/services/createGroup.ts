//interfaces

import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { ChatChannel, Group } from "types/group"

export interface CreateGroupRequest extends Partial<Group> {}

export interface CreateGroupResponse extends Group {}

export interface CreateChatChannelRequest extends Partial<ChatChannel> {}

export interface CreateChatChannelResponse extends ChatChannel {}

//hooks

export async function createGroup(data: CreateGroupRequest) {
  return (await api.post<CreateGroupResponse>("/group", data)).data
}

export function useCreateGroup() {
  return useMutation({
    mutationFn: createGroup,
  })
}

export async function createChatChannel({
  groupId,
  ...data
}: CreateChatChannelRequest) {
  return (
    await api.post<CreateChatChannelResponse>(
      `/group-message-channel/${groupId}`,
      data,
    )
  ).data
}

export function useCreateChatChannel() {
  return useMutation({
    mutationFn: createChatChannel,
  })
}
