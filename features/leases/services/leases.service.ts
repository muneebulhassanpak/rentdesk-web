import { apiClient } from "@/shared/lib/api-client"
import type {
  CreateLeaseRequest,
  Lease,
  LeaseDetail,
  LeaseStatus,
  RenewLeaseRequest,
  TerminateLeaseRequest,
  UpdateLeaseRequest,
} from "@/shared/types/lease.types"
import type { PaginatedResponse } from "@/shared/types/property.types"

const BASE = "/api/v1/leases"
const PROPERTIES_BASE = "/api/v1/properties"
const TENANTS_BASE = "/api/v1/tenants"

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

export type GetLeasesParams = {
  search?: string
  status?: LeaseStatus | "all"
  propertyId?: string
  page?: number
  pageSize?: number
}

export const getLeases = async (
  _orgId: string,
  params: GetLeasesParams = {}
): Promise<PaginatedResponse<Lease>> => {
  const { status, propertyId, page = 1, pageSize = 20 } = params
  const query = new URLSearchParams()
  query.set("page", String(page))
  query.set("page_size", String(pageSize))
  if (status && status !== "all") query.set("status", status)
  if (propertyId) query.set("property_id", propertyId)

  const res = await apiClient<BackendPaginated<Lease>>(
    `${BASE}?${query.toString()}`
  )
  return toPaginated(res)
}

export const getLease = async (
  leaseId: string
): Promise<LeaseDetail | null> => {
  const raw = await apiClient<Omit<LeaseDetail, "primaryTenant">>(
    `${BASE}/${leaseId}`
  )
  const primaryTenant = raw.tenants.find((t) => t.isPrimary) ?? raw.tenants[0]
  return { ...raw, primaryTenant }
}

export const createLease = async (data: CreateLeaseRequest): Promise<Lease> =>
  apiClient<Lease>(BASE, {
    method: "POST",
    body: data,
  })

export const updateLease = async (
  leaseId: string,
  data: UpdateLeaseRequest
): Promise<Lease | null> =>
  apiClient<Lease>(`${BASE}/${leaseId}`, {
    method: "PUT",
    body: data,
  })

export const activateLease = async (leaseId: string): Promise<Lease | null> =>
  apiClient<Lease>(`${BASE}/${leaseId}/activate`, {
    method: "PATCH",
  })

export const renewLease = async (
  leaseId: string,
  data: RenewLeaseRequest
): Promise<Lease> =>
  apiClient<Lease>(`${BASE}/${leaseId}/renew`, {
    method: "POST",
    body: data,
  })

export const terminateLease = async (
  leaseId: string,
  data: TerminateLeaseRequest
): Promise<Lease | null> =>
  apiClient<Lease>(`${BASE}/${leaseId}/terminate`, {
    method: "PATCH",
    body: data,
  })

// ─── Lookup helpers for lease form dropdowns ────────────────────────────────

type OptionItem = { value: string; label: string }

type PropertyListItem = { id: string; name: string }
type UnitListItem = { id: string; label: string; status: string }
type TenantListItem = { id: string; fullName: string }

export const getPropertyOptions = async (): Promise<OptionItem[]> => {
  const res = await apiClient<BackendPaginated<PropertyListItem>>(
    `${PROPERTIES_BASE}?page_size=100`
  )
  return res.items.map((p) => ({ value: p.id, label: p.name }))
}

export const getUnitOptionsForProperty = async (
  propertyId: string
): Promise<OptionItem[]> => {
  const res = await apiClient<BackendPaginated<UnitListItem>>(
    `${PROPERTIES_BASE}/${propertyId}/units?page_size=100`
  )
  return res.items
    .filter((u) => u.status === "vacant" || u.status === "listed")
    .map((u) => ({ value: u.id, label: u.label }))
}

export const getTenantOptions = async (): Promise<OptionItem[]> => {
  const res = await apiClient<BackendPaginated<TenantListItem>>(
    `${TENANTS_BASE}?page_size=100`
  )
  return res.items.map((t) => ({ value: t.id, label: t.fullName }))
}
