export const ROLES = {
  LANDLORD: "landlord",
  MANAGER: "manager",
  TENANT: "tenant",
  VENDOR: "vendor",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export type User = {
  id: string
  email: string
  fullName: string
  role: Role
  orgId: string
  orgName: string
  avatarUrl?: string
  isEmailVerified: boolean
  isTotpEnabled: boolean
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  user: User
  accessToken: string
  refreshToken: string
}

export type RegisterRequest = {
  email: string
  password: string
  fullName: string
  orgName: string
}

export type MagicLinkRequest = {
  email: string
}

export type ForgotPasswordRequest = {
  email: string
}

export type ResetPasswordRequest = {
  token: string
  newPassword: string
}
