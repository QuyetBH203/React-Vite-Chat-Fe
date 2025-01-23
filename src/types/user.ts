export interface User {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  provider: string
  email: string
  wsId: string
  profile: UserProfile
}
export interface UserAuth {
  accessToken: string
  refreshToken: string
}

export interface UserProfile {
  avatarUrl: string
  fullName: string
  gender: string
  userId: string
  phoneNumber: string
}
