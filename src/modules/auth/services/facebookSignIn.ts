import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { User } from "types/user"

export interface FacebookSignInRequest {
  accessToken: string
}

export interface FacebookSignInResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export async function facebookSignIn(data: FacebookSignInRequest) {
  return (
    await api.get<FacebookSignInResponse>(
      `/auth/user/facebook?access_token=${data.accessToken}`,
    )
  ).data
}

export function useFacebookSignIn() {
  return useMutation({
    mutationFn: facebookSignIn,
  })
}
