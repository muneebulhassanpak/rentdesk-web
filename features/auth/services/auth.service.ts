import { apiClient } from "@/shared/lib/api-client"
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  MagicLinkRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "@/shared/types/auth.types"

const AUTH_BASE = "/api/v1/auth"

export const authLogin = (data: LoginRequest): Promise<LoginResponse> =>
  apiClient<LoginResponse>(`${AUTH_BASE}/login`, {
    method: "POST",
    body: data,
  })

export const authRegister = (data: RegisterRequest): Promise<LoginResponse> =>
  apiClient<LoginResponse>(`${AUTH_BASE}/register`, {
    method: "POST",
    body: data,
  })

export const authForgotPassword = (
  data: ForgotPasswordRequest
): Promise<{ message: string }> =>
  apiClient<{ message: string }>(`${AUTH_BASE}/forgot-password`, {
    method: "POST",
    body: data,
  })

export const authResetPassword = (
  data: ResetPasswordRequest
): Promise<{ message: string }> =>
  apiClient<{ message: string }>(`${AUTH_BASE}/reset-password`, {
    method: "POST",
    body: data,
  })

export const authMagicLink = (
  data: MagicLinkRequest
): Promise<{ message: string }> =>
  apiClient<{ message: string }>(`${AUTH_BASE}/magic-link`, {
    method: "POST",
    body: data,
  })

export const authMagicLinkVerify = (token: string): Promise<LoginResponse> =>
  apiClient<LoginResponse>(`${AUTH_BASE}/magic-link/verify`, {
    method: "POST",
    body: { token },
  })
