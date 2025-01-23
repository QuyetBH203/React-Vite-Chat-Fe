import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { BaseGetList, PageParam } from "types/getList"
import { User, UserProfile } from "types/user"
import { MessageType } from "./sendMessage"

export interface GetMessageListFromFriendRequest {
  directMessageChannelId: string
  take?: number
  page?: number
}

export interface GetMessageFromFriendResponse {
  id: string
  isDeleted: boolean
  type: MessageType
  value: string
  userId: string
  directMessageChannelId: string
  user: Pick<User, "profile">
  createdAt: string
  updatedAt: string
}

export interface GetMessageListFromFriendResponse extends BaseGetList {
  data: GetMessageFromFriendResponse[]
}

export interface GetDirectMessageRequest {
  take?: number
}

export interface GetLastMessageResponse {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  type: MessageType
  value: string
  duration: number
  userId: string
  directMessageChannelId: string
  user: Pick<User, "profile">
}
export interface GetDirectMessageResponse {
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  user: {
    isOnline: boolean
    profile: UserProfile
  }
  lastMessage: GetLastMessageResponse
}

export interface GetDirectMessageListResponse extends BaseGetList {
  data: GetDirectMessageResponse[]
}

export async function getGetMessageListFromFriend({
  directMessageChannelId,
  ...params
}: GetMessageListFromFriendRequest) {
  return (
    await api.get<GetMessageListFromFriendResponse>(
      `/direct-message-channel/${directMessageChannelId}/message`,
      { params },
    )
  ).data
}

export function useGetMessageListFromFriend(
  { directMessageChannelId, take = 20, page }: GetMessageListFromFriendRequest,
  userId: string,
) {
  return useInfiniteQuery({
    queryKey: [
      `get-message-from-friend-${directMessageChannelId}`,
      directMessageChannelId,
      userId,
      take,
      page,
    ],

    queryFn: async ({ pageParam: { page } }) =>
      await getGetMessageListFromFriend({
        directMessageChannelId,
        page,
        take,
      }),

    initialPageParam: {
      page: 1,
    } as PageParam,
    getNextPageParam: (lastPage) => {
      if (!lastPage) {
        return
      }

      const { page, take, total } = lastPage.meta

      if (page * take > total) {
        return
      }

      return {
        page: page + 1,
      }
    },
  })
}

export function useGetDirectMessage({ take = 20 }: GetDirectMessageRequest) {
  return useInfiniteQuery({
    queryKey: ["get-direct-message", take],
    queryFn: async ({ pageParam: { page } }) => {
      return (
        await api.get<GetDirectMessageListResponse>(`/direct-message-channel`, {
          params: {
            take,
            page,
          },
        })
      ).data
    },
    initialPageParam: {
      page: 1,
    } as PageParam,
    getNextPageParam: (lastPage) => {
      if (!lastPage) {
        return
      }

      const { page, take, total } = lastPage.meta

      if (page * take > total) {
        return
      }

      return {
        page: page + 1,
      }
    },
  })
}
