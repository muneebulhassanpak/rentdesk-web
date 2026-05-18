"use client"

import {
  createContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react"
import { useRouter } from "next/navigation"

import {
  AUTH_ROUTES,
  ROLE_DASHBOARD_MAP,
} from "@/shared/constants/routes.constants"
import type { User } from "@/shared/types/auth.types"

const AUTH_STORAGE_KEY = "rentdesk_user"

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

let cachedRaw: string | null = null
let cachedUser: User | null = null

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw !== cachedRaw) {
      cachedRaw = raw
      cachedUser = raw ? (JSON.parse(raw) as User) : null
    }
    return cachedUser
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    cachedRaw = null
    cachedUser = null
    return null
  }
}

const listeners = new Set<() => void>()

const subscribe = (callback: () => void) => {
  listeners.add(callback)
  window.addEventListener("storage", callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", callback)
  }
}

const emitChange = () => {
  for (const listener of listeners) {
    listener()
  }
}

const getServerSnapshot = (): User | null => null

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useSyncExternalStore(subscribe, getStoredUser, getServerSnapshot)
  const router = useRouter()

  const login = useCallback(
    (loggedInUser: User) => {
      const json = JSON.stringify(loggedInUser)
      localStorage.setItem(AUTH_STORAGE_KEY, json)
      cachedRaw = json
      cachedUser = loggedInUser
      emitChange()
      router.push(ROLE_DASHBOARD_MAP[loggedInUser.role])
    },
    [router]
  )

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    cachedRaw = null
    cachedUser = null
    emitChange()
    router.push(AUTH_ROUTES.LOGIN)
  }, [router])

  const value = useMemo(
    () => ({ user, isLoading: false, login, logout }),
    [user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
