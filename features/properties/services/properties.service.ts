import { apiClient } from "@/shared/lib/api-client"
import type {
  CreatePropertyRequest,
  CreateUnitRequest,
  PaginatedResponse,
  Property,
  PropertyType,
  Unit,
  UpdatePropertyRequest,
  UpdateUnitRequest,
} from "@/shared/types/property.types"

const PROPERTIES_BASE = "/api/v1/properties"
const UNITS_BASE = "/api/v1/units"

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

// ─── Address mapping ──────────────────────────────────────────────────────────

type RawPropertyResponse = {
  id: string
  orgId: string
  name: string
  type: PropertyType
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  postalCode?: string
  country: string
  coverPhotoUrl?: string
  yearBuilt?: number
  notes?: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  unitsSummary?: {
    total: number
    occupied: number
    vacant: number
    underMaintenance: number
    listed: number
    occupancyPct: number
    monthlyRentRoll: number
  }
}

const toProperty = (raw: RawPropertyResponse): Property => ({
  id: raw.id,
  orgId: raw.orgId,
  name: raw.name,
  type: raw.type,
  address: {
    line1: raw.addressLine1,
    line2: raw.addressLine2,
    city: raw.city,
    state: raw.state,
    postalCode: raw.postalCode,
    country: raw.country,
  },
  coverPhotoUrl: raw.coverPhotoUrl,
  yearBuilt: raw.yearBuilt,
  notes: raw.notes,
  isArchived: raw.isArchived,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
  unitCount: raw.unitsSummary?.total ?? 0,
  occupiedCount: raw.unitsSummary?.occupied ?? 0,
  vacantCount: raw.unitsSummary?.vacant ?? 0,
  maintenanceCount: raw.unitsSummary?.underMaintenance ?? 0,
  occupancyPercent: raw.unitsSummary?.occupancyPct ?? 0,
  monthlyRentRoll: raw.unitsSummary?.monthlyRentRoll ?? 0,
  openTickets: 0,
})

type FlatPropertyBody = {
  name: string
  type: PropertyType
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  postalCode?: string
  country: string
  coverPhotoUrl?: string
  yearBuilt?: number
  notes?: string
}

const flattenRequest = (
  data: CreatePropertyRequest | UpdatePropertyRequest
): Partial<FlatPropertyBody> => {
  const { address, ...rest } = data
  if (!address) return rest
  return {
    ...rest,
    addressLine1: address.line1,
    addressLine2: address.line2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
  }
}

// ─── Property CRUD ────────────────────────────────────────────────────────────

export type GetPropertiesParams = {
  role?: string
  search?: string
  type?: PropertyType
  page?: number
  pageSize?: number
}

export const getProperties = async (
  _orgId: string,
  params: GetPropertiesParams = {}
): Promise<PaginatedResponse<Property>> => {
  const { search, type, page = 1, pageSize = 20 } = params
  const query = new URLSearchParams()
  query.set("page", String(page))
  query.set("page_size", String(pageSize))
  if (search) query.set("search", search)
  if (type) query.set("type", type)

  const res = await apiClient<BackendPaginated<RawPropertyResponse>>(
    `${PROPERTIES_BASE}?${query.toString()}`
  )
  const paginated = toPaginated(res)
  return { ...paginated, data: paginated.data.map(toProperty) }
}

export const getProperty = async (
  propertyId: string
): Promise<Property | null> => {
  const raw = await apiClient<RawPropertyResponse>(
    `${PROPERTIES_BASE}/${propertyId}`
  )
  return toProperty(raw)
}

export const createProperty = async (
  data: CreatePropertyRequest
): Promise<Property> => {
  const raw = await apiClient<RawPropertyResponse>(PROPERTIES_BASE, {
    method: "POST",
    body: flattenRequest(data),
  })
  return toProperty(raw)
}

export const updateProperty = async (
  propertyId: string,
  data: UpdatePropertyRequest
): Promise<Property | null> => {
  const raw = await apiClient<RawPropertyResponse>(
    `${PROPERTIES_BASE}/${propertyId}`,
    {
      method: "PUT",
      body: flattenRequest(data),
    }
  )
  return toProperty(raw)
}

export const archiveProperty = async (propertyId: string): Promise<boolean> => {
  await apiClient(`${PROPERTIES_BASE}/${propertyId}`, { method: "DELETE" })
  return true
}

// ─── Unit CRUD ────────────────────────────────────────────────────────────────

export const getUnits = async (propertyId: string): Promise<Unit[]> => {
  const res = await apiClient<BackendPaginated<Unit>>(
    `${PROPERTIES_BASE}/${propertyId}/units?page_size=100`
  )
  return res.items
}

export const getUnit = async (unitId: string): Promise<Unit | null> =>
  apiClient<Unit>(`${UNITS_BASE}/${unitId}`)

export const createUnit = async (data: CreateUnitRequest): Promise<Unit> => {
  const { propertyId, ...body } = data
  return apiClient<Unit>(`${PROPERTIES_BASE}/${propertyId}/units`, {
    method: "POST",
    body,
  })
}

export const updateUnit = async (
  unitId: string,
  data: UpdateUnitRequest
): Promise<Unit | null> =>
  apiClient<Unit>(`${UNITS_BASE}/${unitId}`, {
    method: "PUT",
    body: data,
  })
