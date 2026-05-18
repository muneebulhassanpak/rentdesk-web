import type { Role } from "@/shared/types/auth.types"

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  MAGIC_LINK: "/magic-link",
  RESET_PASSWORD: "/reset-password",
} as const

export const DASHBOARD_ROUTES = {
  LANDLORD: "/landlord",
  MANAGER: "/manager",
  TENANT: "/tenant",
  VENDOR: "/vendor",
} as const

export const ROLE_DASHBOARD_MAP: Record<Role, string> = {
  landlord: DASHBOARD_ROUTES.LANDLORD,
  manager: DASHBOARD_ROUTES.MANAGER,
  tenant: DASHBOARD_ROUTES.TENANT,
  vendor: DASHBOARD_ROUTES.VENDOR,
}
