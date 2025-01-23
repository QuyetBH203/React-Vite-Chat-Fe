import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { User } from "types/user"

export interface GetUserProfileResponse extends User {}

export async function getUserProfile() {
  return (await api.get<GetUserProfileResponse>("/user/profile")).data
}

export function useGetUserProfile() {
  return useMutation({
    mutationFn: getUserProfile,
  })
}
