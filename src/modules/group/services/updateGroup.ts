import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { Group } from "types/group"

export interface UpdateGroupRequest extends Partial<Group> {}

export interface UpdateGroupResponse extends Group {}

interface PropsUpdateGroup extends UpdateGroupRequest {
  groupId: string
}

export async function updateGroup({ groupId, ...data }: PropsUpdateGroup) {
  return (await api.patch<UpdateGroupResponse>(`/group/${groupId}`, data)).data
}

export function useUpdateGroup() {
  return useMutation({
    mutationFn: updateGroup,
  })
}
