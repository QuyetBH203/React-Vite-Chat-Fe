import { api } from "configs/api"

export interface RefreshTokenRequest {
  refreshToken: string
}
export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export async function refreshToken(data: RefreshTokenRequest) {
  return (
    await api.post<RefreshTokenResponse>("/auth/user/refresh-token", data)
  ).data
}
