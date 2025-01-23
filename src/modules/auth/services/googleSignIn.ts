import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { User } from "types/user"

export interface GoogleSignInRequest {
  code: string
}
export interface GoogleSignInResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export async function googleSignIn(data: GoogleSignInRequest) {
  return (await api.post<GoogleSignInResponse>("/auth/user/google", data)).data
}

export function useGoogleSignIn() {
  return useMutation({
    mutationFn: googleSignIn,
  })
}
