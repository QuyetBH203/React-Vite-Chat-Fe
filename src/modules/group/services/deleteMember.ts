import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"

export interface DeleteMemberRequest {
  groupId: string
  deleteUserId: string
}

export function deleteMember({ groupId, deleteUserId }: DeleteMemberRequest) {
  return api.delete(`/group/${groupId}/members/${deleteUserId}`)
}
export function useDeleteMember() {
  return useMutation({
    mutationFn: deleteMember,
  })
}
