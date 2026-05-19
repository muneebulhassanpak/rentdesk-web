import { apiClient } from "@/shared/lib/api-client"
import type {
  CollectionSummary,
  Payment,
  PaymentDetail,
  PaymentStatus,
  RecordPaymentRequest,
  RentRoll,
} from "@/shared/types/payment.types"
import type { PaginatedResponse } from "@/shared/types/property.types"

const BASE = "/api/v1/payments"

type BackendPaginated<T> = {
  items: T[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

const toPaginated = <T>(res: BackendPaginated<T>): PaginatedResponse<T> => ({
  data: res.items,
  total: res.meta.total,
  page: res.meta.page,
  pageSize: res.meta.pageSize,
  pageCount: res.meta.totalPages,
})

export type GetPaymentsParams = {
  status?: PaymentStatus | "all"
  propertyId?: string
  month?: string
  page?: number
  pageSize?: number
}

export const getPayments = async (
  _orgId: string,
  params: GetPaymentsParams = {}
): Promise<PaginatedResponse<Payment>> => {
  const { status, propertyId, month, page = 1, pageSize = 20 } = params
  const query = new URLSearchParams()
  query.set("page", String(page))
  query.set("page_size", String(pageSize))
  if (status && status !== "all") query.set("status", status)
  if (propertyId) query.set("property_id", propertyId)
  if (month) query.set("month", `${month}-01`)

  const res = await apiClient<BackendPaginated<Payment>>(
    `${BASE}?${query.toString()}`
  )
  return toPaginated(res)
}

export const getPayment = async (
  paymentId: string
): Promise<PaymentDetail | null> =>
  apiClient<PaymentDetail>(`${BASE}/${paymentId}`)

export const recordPayment = async (
  paymentId: string,
  data: RecordPaymentRequest
): Promise<Payment> =>
  apiClient<Payment>(`${BASE}/${paymentId}/record`, {
    method: "POST",
    body: data,
  })

export const waivePayment = async (paymentId: string): Promise<Payment> =>
  apiClient<Payment>(`${BASE}/${paymentId}/waive`, {
    method: "PATCH",
  })

export const waiveLateFee = async (paymentId: string): Promise<Payment> =>
  apiClient<Payment>(`${BASE}/${paymentId}/waive-late-fee`, {
    method: "PATCH",
  })

export const getCollectionSummary = async (
  month?: string
): Promise<CollectionSummary> => {
  const query = month ? `?month=${month}-01` : ""
  return apiClient<CollectionSummary>(`${BASE}/summary${query}`)
}

export const getLeasePayments = async (leaseId: string): Promise<Payment[]> =>
  apiClient<Payment[]>(`/api/v1/leases/${leaseId}/payments`)

export const getRentRoll = async (
  propertyId: string,
  month?: string
): Promise<RentRoll> => {
  const query = month ? `?month=${month}-01` : ""
  return apiClient<RentRoll>(
    `/api/v1/properties/${propertyId}/rent-roll${query}`
  )
}

// ─── Lookup helpers for filters ──────────────────────────────────────────────

type OptionItem = { value: string; label: string }
type PropertyListItem = { id: string; name: string }

type BackendPaginatedSimple<T> = {
  items: T[]
  meta: { page: number; pageSize: number; total: number; totalPages: number }
}

export const getPropertyOptions = async (): Promise<OptionItem[]> => {
  const res = await apiClient<BackendPaginatedSimple<PropertyListItem>>(
    "/api/v1/properties?page_size=100"
  )
  return res.items.map((p) => ({ value: p.id, label: p.name }))
}

export const createStripeCheckout = async (
  paymentId: string
): Promise<{ checkoutUrl: string }> =>
  apiClient<{ checkoutUrl: string }>(`${BASE}/${paymentId}/stripe-checkout`, {
    method: "POST",
  })
