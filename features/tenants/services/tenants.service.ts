import { apiClient } from "@/shared/lib/api-client"
import type { PaginatedResponse } from "@/shared/types/property.types"
import type {
  InviteTenantRequest,
  Tenant,
  TenantDetail,
  TenantStatus,
  UpdateTenantRequest,
} from "@/shared/types/tenant.types"

const BASE = "/api/v1/tenants"

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

type RawTenant = Omit<Tenant, "status"> & { isActive: boolean }

const deriveTenantStatus = (raw: RawTenant): Tenant => ({
  ...raw,
  status: raw.isActive ? "active" : "inactive",
})

export type GetTenantsParams = {
  search?: string
  status?: TenantStatus | "all"
  page?: number
  pageSize?: number
}

export const getTenants = async (
  _orgId: string,
  params: GetTenantsParams = {}
): Promise<PaginatedResponse<Tenant>> => {
  const { search, status, page = 1, pageSize = 20 } = params
  const query = new URLSearchParams()
  query.set("page", String(page))
  query.set("page_size", String(pageSize))
  if (search) query.set("search", search)
  if (status && status !== "all") query.set("active_only", "true")

  const res = await apiClient<BackendPaginated<RawTenant>>(
    `${BASE}?${query.toString()}`
  )
  const paginated = toPaginated(res)
  return { ...paginated, data: paginated.data.map(deriveTenantStatus) }
}

type RawTenantDetail = Omit<TenantDetail, "status"> & { isActive: boolean }

export const getTenant = async (
  tenantId: string
): Promise<TenantDetail | null> => {
  const raw = await apiClient<RawTenantDetail>(`${BASE}/${tenantId}`)
  return { ...raw, status: raw.isActive ? "active" : "inactive" }
}

export const createTenant = async (
  data: InviteTenantRequest
): Promise<Tenant> =>
  apiClient<Tenant>(`${BASE}/invite`, {
    method: "POST",
    body: data,
  })

export const updateTenant = async (
  tenantId: string,
  data: UpdateTenantRequest
): Promise<Tenant | null> =>
  apiClient<Tenant>(`${BASE}/${tenantId}`, {
    method: "PUT",
    body: data,
  })

export const deactivateTenant = async (
  tenantId: string
): Promise<Tenant | null> =>
  apiClient<Tenant>(`${BASE}/${tenantId}/deactivate`, {
    method: "PATCH",
  })
