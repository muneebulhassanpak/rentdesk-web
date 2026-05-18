"use client"

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"
import { useRouter } from "next/navigation"

import {
  AUTH_ROUTES,
  ROLE_DASHBOARD_MAP,
} from "@/shared/constants/routes.constants"
import { ApiError } from "@/shared/lib/api-client"
import { authGetMe, authLogout } from "@/shared/services/auth-session.service"
import type { User } from "@/shared/types/auth.types"

const HTTP_UNAUTHORIZED = 401

const USER_STORAGE_KEY = "rentdesk_user"

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
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (raw !== cachedRaw) {
      cachedRaw = raw
      cachedUser = raw ? (JSON.parse(raw) as User) : null
    }
    return cachedUser
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
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

const setStoredUser = (user: User | null) => {
  if (user) {
    const json = JSON.stringify(user)
    localStorage.setItem(USER_STORAGE_KEY, json)
    cachedRaw = json
    cachedUser = user
  } else {
    localStorage.removeItem(USER_STORAGE_KEY)
    cachedRaw = null
    cachedUser = null
  }
  emitChange()
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useSyncExternalStore(subscribe, getStoredUser, getServerSnapshot)
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  // Signal that client has mounted and localStorage values are available
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: transitions from SSR loading to client-ready
    setIsReady(true)
  }, [])

  // Validate session on mount via httpOnly cookie
  useEffect(() => {
    let cancelled = false
    authGetMe()
      .then((freshUser) => {
        if (!cancelled) {
          setStoredUser(freshUser)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const isUnauthorized =
            err instanceof ApiError && err.statusCode === HTTP_UNAUTHORIZED
          if (isUnauthorized) {
            setStoredUser(null)
          }
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(
    (loggedInUser: User) => {
      setStoredUser(loggedInUser)
      router.push(ROLE_DASHBOARD_MAP[loggedInUser.role])
    },
    [router]
  )

  const logout = useCallback(() => {
    authLogout().catch(() => {})
    setStoredUser(null)
    router.push(AUTH_ROUTES.LOGIN)
  }, [router])

  const value = useMemo(
    () => ({ user, isLoading: !isReady, login, logout }),
    [user, isReady, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
