import { env } from "@/shared/config/env"

const TOKEN_KEY = "rentdesk_access_token"
const REFRESH_KEY = "rentdesk_refresh_token"
const HTTP_UNAUTHORIZED = 401

// ─── Token storage ───────────────────────────────────────────────────────────

export const getAccessToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null

export const getRefreshToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_KEY, refreshToken)
}

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

// ─── Case conversion ─────────────────────────────────────────────────────────

const toSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

const toCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())

const convertKeys = (
  obj: unknown,
  converter: (key: string) => string
): unknown => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeys(item, converter))
  }
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
        converter(key),
        convertKeys(value, converter),
      ])
    )
  }
  return obj
}

const toSnake = <T>(data: T): T => convertKeys(data, toSnakeCase) as T
const toCamel = <T>(data: T): T => convertKeys(data, toCamelCase) as T

// ─── API error ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// ─── Fetch wrapper ───────────────────────────────────────────────────────────

type RequestOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  auth?: boolean
}

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

const attemptRefresh = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!res.ok) {
      clearTokens()
      return false
    }

    const data = (await res.json()) as {
      access_token: string
      refresh_token: string
    }
    setTokens(data.access_token, data.refresh_token)
    return true
  } catch {
    clearTokens()
    return false
  }
}

export const apiClient = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { method = "GET", body, headers = {}, auth = true } = options

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  }

  if (auth) {
    const token = getAccessToken()
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`
    }
  }

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    method,
    headers: requestHeaders,
    ...(body !== undefined && { body: JSON.stringify(toSnake(body)) }),
  })

  // Handle 401 with token refresh
  if (res.status === HTTP_UNAUTHORIZED && auth) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = attemptRefresh().finally(() => {
        isRefreshing = false
        refreshPromise = null
      })
    }

    const refreshed = await refreshPromise
    if (refreshed) {
      // Retry the original request with new token
      const newToken = getAccessToken()
      if (newToken) {
        requestHeaders["Authorization"] = `Bearer ${newToken}`
      }

      const retryRes = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
        method,
        headers: requestHeaders,
        ...(body !== undefined && { body: JSON.stringify(toSnake(body)) }),
      })

      if (!retryRes.ok) {
        const errorData = await retryRes.json().catch(() => null)
        throw new ApiError(
          retryRes.status,
          (errorData as { detail?: string } | null)?.detail ??
            retryRes.statusText
        )
      }

      return toCamel(await retryRes.json()) as T
    }

    // Refresh failed — clear and throw
    clearTokens()
    throw new ApiError(
      HTTP_UNAUTHORIZED,
      "Session expired. Please sign in again."
    )
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new ApiError(
      res.status,
      (errorData as { detail?: string } | null)?.detail ?? res.statusText
    )
  }

  // Handle 204 No Content
  const NO_CONTENT = 204
  if (res.status === NO_CONTENT) {
    return undefined as T
  }

  return toCamel(await res.json()) as T
}
