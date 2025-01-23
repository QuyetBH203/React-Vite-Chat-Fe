import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"

export async function countFriendRequestToMe() {
  return (await api.get<number>("/friend/request/count-to-me")).data
}
export function useCountFriendRequestToMe() {
  return useQuery({
    queryKey: ["countFriendRequestToMe"],
    queryFn: countFriendRequestToMe,
    refetchInterval: 10000,
  })
}
