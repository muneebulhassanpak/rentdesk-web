import { apiClient } from "@/shared/lib/api-client"
import type { User } from "@/shared/types/auth.types"

const AUTH_BASE = "/api/v1/auth"

export const authGetMe = (): Promise<User> => apiClient<User>(`${AUTH_BASE}/me`)

export const authLogout = (): Promise<{ message: string }> =>
  apiClient<{ message: string }>(`${AUTH_BASE}/logout`, {
    method: "POST",
  })
