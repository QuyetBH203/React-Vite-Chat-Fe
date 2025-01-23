import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"

export interface LeaveGroupRequest {
  groupId: string
}

export function leaveGroup({ groupId }: LeaveGroupRequest) {
  return api.post(`/group/${groupId}/leave`)
}
export function useLeaveGroup() {
  return useMutation({
    mutationFn: leaveGroup,
  })
}
