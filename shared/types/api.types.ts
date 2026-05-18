export type ApiResponse<T> = {
  data: T
  message?: string
}

export type ApiErrorResponse = {
  error: string
  message: string
  statusCode: number
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }
