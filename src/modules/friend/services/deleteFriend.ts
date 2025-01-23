import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"

export function deleteFriend(friendId: string) {
  return api.delete(`/friend/${friendId}`)
}
export function useDeleteFriend() {
  return useMutation({
    mutationFn: deleteFriend,
  })
}
