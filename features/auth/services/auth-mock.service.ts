import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  MagicLinkRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from "@/shared/types/auth.types"

const MOCK_ORG_ID = "org_oaktree_001"
const MOCK_ORG_NAME = "Oak Tree Properties"
const UUID_SLICE_LENGTH = 8

const MOCK_USERS: Record<string, User> = {
  "landlord@oaktree.demo": {
    id: "usr_landlord_001",
    email: "landlord@oaktree.demo",
    fullName: "Rachel Whitman",
    role: "landlord",
    orgId: MOCK_ORG_ID,
    orgName: MOCK_ORG_NAME,
    isEmailVerified: true,
    isTotpEnabled: false,
  },
  "manager@oaktree.demo": {
    id: "usr_manager_001",
    email: "manager@oaktree.demo",
    fullName: "David Park",
    role: "manager",
    orgId: MOCK_ORG_ID,
    orgName: MOCK_ORG_NAME,
    isEmailVerified: true,
    isTotpEnabled: false,
  },
  "tenant1@oaktree.demo": {
    id: "usr_tenant_001",
    email: "tenant1@oaktree.demo",
    fullName: "Sarah Chen",
    role: "tenant",
    orgId: MOCK_ORG_ID,
    orgName: MOCK_ORG_NAME,
    isEmailVerified: true,
    isTotpEnabled: false,
  },
  "vendor@reliable.demo": {
    id: "usr_vendor_001",
    email: "vendor@reliable.demo",
    fullName: "Mike Johnson",
    role: "vendor",
    orgId: MOCK_ORG_ID,
    orgName: MOCK_ORG_NAME,
    isEmailVerified: true,
    isTotpEnabled: false,
  },
}

const MOCK_PASSWORD = "demo1234"
const MOCK_DELAY_MS = 500

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  await delay(MOCK_DELAY_MS)

  const user = MOCK_USERS[data.email.toLowerCase()]
  if (!user || data.password !== MOCK_PASSWORD) {
    throw new Error("Invalid email or password")
  }

  return {
    user,
    accessToken: "mock_access_token",
    refreshToken: "mock_refresh_token",
  }
}

export const mockRegister = async (
  data: RegisterRequest
): Promise<LoginResponse> => {
  await delay(MOCK_DELAY_MS)

  const user: User = {
    id: `usr_${crypto.randomUUID().slice(0, UUID_SLICE_LENGTH)}`,
    email: data.email,
    fullName: data.fullName,
    role: "landlord",
    orgId: `org_${crypto.randomUUID().slice(0, UUID_SLICE_LENGTH)}`,
    orgName: data.orgName,
    isEmailVerified: false,
    isTotpEnabled: false,
  }

  return {
    user,
    accessToken: "mock_access_token",
    refreshToken: "mock_refresh_token",
  }
}

export const mockForgotPassword = async (
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  _data: ForgotPasswordRequest
): Promise<{ message: string }> => {
  await delay(MOCK_DELAY_MS)
  return {
    message:
      "If an account exists with that email, a reset link has been sent.",
  }
}

export const mockResetPassword = async (
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  _data: ResetPasswordRequest
): Promise<{ message: string }> => {
  await delay(MOCK_DELAY_MS)
  return { message: "Password has been reset successfully." }
}

export const mockMagicLink = async (
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  _data: MagicLinkRequest
): Promise<{ message: string }> => {
  await delay(MOCK_DELAY_MS)
  return { message: "Check your email for a login link." }
}
