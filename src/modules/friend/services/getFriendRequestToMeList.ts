import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { PaginationDto } from "types/api"
import { BaseGetList } from "types/getList"
import { UserProfile } from "types/user"

interface GetFriendRequestToMeListResponse extends BaseGetList {
  data: UserProfile[]
}

export async function getFriendRequestToMeList(params: PaginationDto) {
  return (
    await api.get<GetFriendRequestToMeListResponse>("/friend/request/to-me", {
      params,
    })
  ).data
}
export function useGetFriendRequestToMeList(params: PaginationDto) {
  return useInfiniteQuery({
    queryKey: ["getFriendRequestToMeList", params],
    queryFn: ({ pageParam }) =>
      getFriendRequestToMeList({ ...params, page: pageParam.nextPage }),
    initialPageParam: {
      nextPage: params.page || 1,
    },
    getNextPageParam: ({ meta: { page, take, total } }) =>
      page * take > total ? undefined : { nextPage: page + 1 },
    refetchInterval: 10000,
  })
}
