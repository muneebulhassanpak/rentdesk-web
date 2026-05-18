"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { AUTH_ROUTES } from "@/shared/constants/routes.constants"
import { useAuth } from "@/shared/hooks/use-auth.hook"
import type { Role } from "@/shared/types/auth.types"

type AuthGuardProps = {
  children: React.ReactNode
  allowedRoles?: Role[]
}

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace(AUTH_ROUTES.LOGIN)
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(AUTH_ROUTES.LOGIN)
    }
  }, [user, isLoading, allowedRoles, router])

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return null
  if (allowedRoles && !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
