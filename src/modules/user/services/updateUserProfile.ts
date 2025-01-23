import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { UserProfile } from "types/user"

export interface UpdateUserProfileRequest extends Partial<UserProfile> {}

export interface UpdateUserProfileResponse extends UserProfile {}

export async function updateUserProfile(data: UpdateUserProfileRequest) {
  return (await api.patch<UpdateUserProfileResponse>("/user/profile", data))
    .data
}

export function useUpdateUserProfile() {
  return useMutation({
    mutationFn: updateUserProfile,
  })
}
