import type {
  CreateLeaseRequest,
  Lease,
  LeaseDetail,
  LeaseStatus,
  LeaseTenant,
  RenewLeaseRequest,
  TerminateLeaseRequest,
  UpdateLeaseRequest,
} from "@/shared/types/lease.types"
import type { PaginatedResponse } from "@/shared/types/property.types"

const MOCK_ORG_ID = "org_oaktree_001"
const MOCK_DELAY_MS = 300
const UUID_SLICE_LENGTH = 8
const DEFAULT_PAGE_SIZE = 10
const EXPIRING_SOON_DAYS = 60
// eslint-disable-next-line no-magic-numbers
const MS_PER_DAY = 1000 * 60 * 60 * 24

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── Inline lookup tables (avoids cross-feature imports) ──────────────────

type PropertyOption = { id: string; name: string }
type UnitOption = {
  id: string
  propertyId: string
  label: string
  status: string
}
type TenantOption = {
  id: string
  fullName: string
  email: string
  avatarUrl?: string
}

const PROPERTY_OPTIONS: PropertyOption[] = [
  { id: "prop_001", name: "12 Maple Street" },
  { id: "prop_002", name: "45 Oak Avenue" },
  { id: "prop_003", name: "Riverside Condos" },
  { id: "prop_004", name: "78 Pine Road" },
  { id: "prop_005", name: "Commerce Plaza" },
]

const UNIT_OPTIONS: UnitOption[] = [
  { id: "unit_001", propertyId: "prop_001", label: "1A", status: "occupied" },
  { id: "unit_002", propertyId: "prop_001", label: "1B", status: "occupied" },
  { id: "unit_003", propertyId: "prop_001", label: "2A", status: "vacant" },
  { id: "unit_004", propertyId: "prop_001", label: "2B", status: "occupied" },
  { id: "unit_005", propertyId: "prop_002", label: "Main", status: "occupied" },
  { id: "unit_006", propertyId: "prop_003", label: "101", status: "occupied" },
  { id: "unit_007", propertyId: "prop_003", label: "102", status: "occupied" },
  {
    id: "unit_008",
    propertyId: "prop_003",
    label: "201",
    status: "under_maintenance",
  },
  { id: "unit_009", propertyId: "prop_003", label: "202", status: "occupied" },
  { id: "unit_010", propertyId: "prop_003", label: "301", status: "vacant" },
  { id: "unit_011", propertyId: "prop_003", label: "302", status: "occupied" },
  { id: "unit_012", propertyId: "prop_004", label: "Main", status: "occupied" },
  {
    id: "unit_013",
    propertyId: "prop_005",
    label: "Suite A",
    status: "occupied",
  },
  {
    id: "unit_014",
    propertyId: "prop_005",
    label: "Suite B",
    status: "vacant",
  },
  {
    id: "unit_015",
    propertyId: "prop_005",
    label: "Suite C",
    status: "occupied",
  },
  {
    id: "unit_016",
    propertyId: "prop_005",
    label: "Office 201",
    status: "under_maintenance",
  },
  {
    id: "unit_017",
    propertyId: "prop_005",
    label: "Office 202",
    status: "occupied",
  },
  {
    id: "unit_018",
    propertyId: "prop_005",
    label: "Office 203",
    status: "listed",
  },
]

const TENANT_OPTIONS: TenantOption[] = [
  { id: "ten_001", fullName: "Maria Santos", email: "maria.santos@email.com" },
  { id: "ten_002", fullName: "James Chen", email: "james.chen@email.com" },
  {
    id: "ten_003",
    fullName: "Aisha Johnson",
    email: "aisha.johnson@email.com",
  },
  { id: "ten_004", fullName: "David Kim", email: "david.kim@email.com" },
  { id: "ten_005", fullName: "Sarah Patel", email: "sarah.patel@email.com" },
  {
    id: "ten_006",
    fullName: "Michael O'Connor",
    email: "michael.oconnor@email.com",
  },
  {
    id: "ten_007",
    fullName: "Elena Rodriguez",
    email: "elena.rodriguez@email.com",
  },
  {
    id: "ten_008",
    fullName: "Marcus Wright",
    email: "marcus.wright@email.com",
  },
  { id: "ten_009", fullName: "Lisa Nguyen", email: "lisa.nguyen@email.com" },
  { id: "ten_010", fullName: "Tom Baker", email: "tom.baker@email.com" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────

const lookupProperty = (id: string) => PROPERTY_OPTIONS.find((p) => p.id === id)
const lookupUnit = (id: string) => UNIT_OPTIONS.find((u) => u.id === id)
const lookupTenant = (id: string) => TENANT_OPTIONS.find((t) => t.id === id)

const buildTenants = (
  tenantIds: string[],
  primaryTenantId: string
): LeaseTenant[] => {
  const result: LeaseTenant[] = []
  for (const id of tenantIds) {
    const t = lookupTenant(id)
    if (!t) continue
    result.push({
      tenantId: t.id,
      fullName: t.fullName,
      email: t.email,
      avatarUrl: t.avatarUrl,
      isPrimary: t.id === primaryTenantId,
    })
  }
  return result
}

const computeStatus = (baseStatus: string, endDate: string): LeaseStatus => {
  if (baseStatus === "draft" || baseStatus === "terminated") {
    return baseStatus as LeaseStatus
  }
  const now = new Date()
  const end = new Date(endDate)
  if (end < now) return "expired"
  const daysUntilEnd = Math.ceil((end.getTime() - now.getTime()) / MS_PER_DAY)
  if (daysUntilEnd <= EXPIRING_SOON_DAYS) return "expiring_soon"
  return "active"
}

// ─── Seed: Leases ─────────────────────────────────────────────────────────

type SeedLease = {
  id: string
  orgId: string
  unitId: string
  propertyId: string
  baseStatus: string
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit: number
  paymentDueDay: number
  notes?: string
  tenantIds: string[]
  primaryTenantId: string
  renewedFromLeaseId?: string
  createdAt: string
  updatedAt: string
}

const SEED_LEASES: SeedLease[] = [
  {
    id: "lease_001",
    orgId: MOCK_ORG_ID,
    unitId: "unit_001",
    propertyId: "prop_001",
    baseStatus: "active",
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    monthlyRent: 1200,
    securityDeposit: 1200,
    paymentDueDay: 1,
    tenantIds: ["ten_001"],
    primaryTenantId: "ten_001",
    createdAt: "2025-06-15",
    updatedAt: "2025-07-01",
  },
  {
    id: "lease_002",
    orgId: MOCK_ORG_ID,
    unitId: "unit_002",
    propertyId: "prop_001",
    baseStatus: "active",
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    monthlyRent: 1250,
    securityDeposit: 1250,
    paymentDueDay: 1,
    tenantIds: ["ten_002"],
    primaryTenantId: "ten_002",
    createdAt: "2025-06-15",
    updatedAt: "2025-07-01",
  },
  {
    id: "lease_003",
    orgId: MOCK_ORG_ID,
    unitId: "unit_004",
    propertyId: "prop_001",
    baseStatus: "active",
    startDate: "2025-07-01",
    endDate: "2026-07-15",
    monthlyRent: 1650,
    securityDeposit: 1650,
    paymentDueDay: 1,
    tenantIds: ["ten_003"],
    primaryTenantId: "ten_003",
    createdAt: "2025-06-20",
    updatedAt: "2025-07-01",
  },
  {
    id: "lease_004",
    orgId: MOCK_ORG_ID,
    unitId: "unit_005",
    propertyId: "prop_002",
    baseStatus: "active",
    startDate: "2025-05-01",
    endDate: "2026-04-30",
    monthlyRent: 2800,
    securityDeposit: 2800,
    paymentDueDay: 1,
    tenantIds: ["ten_004"],
    primaryTenantId: "ten_004",
    createdAt: "2025-04-15",
    updatedAt: "2025-05-01",
  },
  {
    id: "lease_005",
    orgId: MOCK_ORG_ID,
    unitId: "unit_006",
    propertyId: "prop_003",
    baseStatus: "active",
    startDate: "2025-03-01",
    endDate: "2026-02-28",
    monthlyRent: 1100,
    securityDeposit: 1100,
    paymentDueDay: 1,
    tenantIds: ["ten_005"],
    primaryTenantId: "ten_005",
    createdAt: "2025-02-15",
    updatedAt: "2025-03-01",
  },
  {
    id: "lease_006",
    orgId: MOCK_ORG_ID,
    unitId: "unit_007",
    propertyId: "prop_003",
    baseStatus: "active",
    startDate: "2025-03-01",
    endDate: "2026-02-28",
    monthlyRent: 1150,
    securityDeposit: 1150,
    paymentDueDay: 1,
    tenantIds: ["ten_006"],
    primaryTenantId: "ten_006",
    createdAt: "2025-02-15",
    updatedAt: "2025-03-01",
  },
  {
    id: "lease_007",
    orgId: MOCK_ORG_ID,
    unitId: "unit_009",
    propertyId: "prop_003",
    baseStatus: "active",
    startDate: "2025-04-01",
    endDate: "2026-07-01",
    monthlyRent: 1800,
    securityDeposit: 1800,
    paymentDueDay: 1,
    notes: "Co-tenants: Elena Rodriguez (primary) and Marcus Wright",
    tenantIds: ["ten_007", "ten_008"],
    primaryTenantId: "ten_007",
    createdAt: "2025-03-15",
    updatedAt: "2025-04-01",
  },
  {
    id: "lease_008",
    orgId: MOCK_ORG_ID,
    unitId: "unit_011",
    propertyId: "prop_003",
    baseStatus: "active",
    startDate: "2025-05-01",
    endDate: "2026-04-30",
    monthlyRent: 2100,
    securityDeposit: 2100,
    paymentDueDay: 1,
    tenantIds: ["ten_009"],
    primaryTenantId: "ten_009",
    createdAt: "2025-04-15",
    updatedAt: "2025-05-01",
  },
  {
    id: "lease_009",
    orgId: MOCK_ORG_ID,
    unitId: "unit_013",
    propertyId: "prop_005",
    baseStatus: "active",
    startDate: "2025-03-01",
    endDate: "2027-02-28",
    monthlyRent: 2500,
    securityDeposit: 5000,
    paymentDueDay: 1,
    notes: "Commercial lease — 2-year term",
    tenantIds: ["ten_005"],
    primaryTenantId: "ten_005",
    createdAt: "2025-02-15",
    updatedAt: "2025-03-01",
  },
  {
    id: "lease_010",
    orgId: MOCK_ORG_ID,
    unitId: "unit_012",
    propertyId: "prop_004",
    baseStatus: "active",
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    monthlyRent: 3200,
    securityDeposit: 3200,
    paymentDueDay: 1,
    tenantIds: ["ten_010"],
    primaryTenantId: "ten_010",
    createdAt: "2025-05-15",
    updatedAt: "2025-06-01",
  },
  {
    id: "lease_011",
    orgId: MOCK_ORG_ID,
    unitId: "unit_015",
    propertyId: "prop_005",
    baseStatus: "active",
    startDate: "2025-02-01",
    endDate: "2027-01-31",
    monthlyRent: 3500,
    securityDeposit: 7000,
    paymentDueDay: 1,
    notes: "Commercial lease — 2-year term",
    tenantIds: ["ten_006"],
    primaryTenantId: "ten_006",
    createdAt: "2025-01-15",
    updatedAt: "2025-02-01",
  },
  {
    id: "lease_012",
    orgId: MOCK_ORG_ID,
    unitId: "unit_017",
    propertyId: "prop_005",
    baseStatus: "active",
    startDate: "2025-04-01",
    endDate: "2026-03-31",
    monthlyRent: 1500,
    securityDeposit: 3000,
    paymentDueDay: 1,
    tenantIds: ["ten_009"],
    primaryTenantId: "ten_009",
    createdAt: "2025-03-15",
    updatedAt: "2025-04-01",
  },
]

// ─── Mutable mock array ─────────────────────────────────────────────────────

let mockLeases: SeedLease[] = [...SEED_LEASES]

const buildLease = (seed: SeedLease): Lease => {
  const unit = lookupUnit(seed.unitId)
  const property = lookupProperty(seed.propertyId)
  return {
    id: seed.id,
    orgId: seed.orgId,
    unitId: seed.unitId,
    propertyId: seed.propertyId,
    status: computeStatus(seed.baseStatus, seed.endDate),
    startDate: seed.startDate,
    endDate: seed.endDate,
    monthlyRent: seed.monthlyRent,
    securityDeposit: seed.securityDeposit,
    paymentDueDay: seed.paymentDueDay,
    notes: seed.notes,
    renewedFromLeaseId: seed.renewedFromLeaseId,
    createdAt: seed.createdAt,
    updatedAt: seed.updatedAt,
    unitLabel: unit?.label ?? "Unknown",
    propertyName: property?.name ?? "Unknown",
    tenants: buildTenants(seed.tenantIds, seed.primaryTenantId),
  }
}

// ─── Service functions ──────────────────────────────────────────────────────

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
  await delay(MOCK_DELAY_MS)
  const {
    search,
    status = "all",
    propertyId,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = params

  let filtered = mockLeases.map(buildLease)

  if (status !== "all") {
    filtered = filtered.filter((l) => l.status === status)
  }

  if (propertyId) {
    filtered = filtered.filter((l) => l.propertyId === propertyId)
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (l) =>
        l.propertyName.toLowerCase().includes(q) ||
        l.unitLabel.toLowerCase().includes(q) ||
        l.tenants.some((t) => t.fullName.toLowerCase().includes(q))
    )
  }

  // Sort by end date ascending (soonest expiring first)
  filtered.sort(
    (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  )

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  return { data: paged, total, page, pageSize, pageCount }
}

export const getLease = async (
  leaseId: string
): Promise<LeaseDetail | null> => {
  await delay(MOCK_DELAY_MS)
  const found = mockLeases.find((l) => l.id === leaseId)
  if (!found) return null
  const lease = buildLease(found)
  const primaryTenant =
    lease.tenants.find((t) => t.isPrimary) ?? lease.tenants[0]
  return { ...lease, primaryTenant }
}

export const createLease = async (data: CreateLeaseRequest): Promise<Lease> => {
  await delay(MOCK_DELAY_MS)
  const now = new Date().toISOString()
  const seed: SeedLease = {
    id: `lease_${crypto.randomUUID().slice(0, UUID_SLICE_LENGTH)}`,
    orgId: MOCK_ORG_ID,
    unitId: data.unitId,
    propertyId: data.propertyId,
    baseStatus: "draft",
    startDate: data.startDate,
    endDate: data.endDate,
    monthlyRent: data.monthlyRent,
    securityDeposit: data.securityDeposit,
    paymentDueDay: data.paymentDueDay,
    notes: data.notes,
    tenantIds: data.tenantIds,
    primaryTenantId: data.primaryTenantId,
    createdAt: now,
    updatedAt: now,
  }
  mockLeases = [...mockLeases, seed]
  return buildLease(seed)
}

export const updateLease = async (
  leaseId: string,
  data: UpdateLeaseRequest
): Promise<Lease | null> => {
  await delay(MOCK_DELAY_MS)
  const index = mockLeases.findIndex((l) => l.id === leaseId)
  if (index === -1) return null

  const updated: SeedLease = {
    ...mockLeases[index],
    ...data,
    tenantIds: data.tenantIds ?? mockLeases[index].tenantIds,
    primaryTenantId: data.primaryTenantId ?? mockLeases[index].primaryTenantId,
    updatedAt: new Date().toISOString(),
  }
  mockLeases = mockLeases.map((l) => (l.id === leaseId ? updated : l))
  return buildLease(updated)
}

export const activateLease = async (leaseId: string): Promise<Lease | null> => {
  await delay(MOCK_DELAY_MS)
  const index = mockLeases.findIndex((l) => l.id === leaseId)
  if (index === -1) return null

  const updated: SeedLease = {
    ...mockLeases[index],
    baseStatus: "active",
    updatedAt: new Date().toISOString(),
  }
  mockLeases = mockLeases.map((l) => (l.id === leaseId ? updated : l))
  return buildLease(updated)
}

export const renewLease = async (
  leaseId: string,
  data: RenewLeaseRequest
): Promise<Lease> => {
  await delay(MOCK_DELAY_MS)
  const original = mockLeases.find((l) => l.id === leaseId)
  if (!original) throw new Error("Lease not found")

  const now = new Date().toISOString()
  const seed: SeedLease = {
    id: `lease_${crypto.randomUUID().slice(0, UUID_SLICE_LENGTH)}`,
    orgId: MOCK_ORG_ID,
    unitId: original.unitId,
    propertyId: original.propertyId,
    baseStatus: "draft",
    startDate: data.startDate,
    endDate: data.endDate,
    monthlyRent: data.monthlyRent,
    securityDeposit: data.securityDeposit,
    paymentDueDay: data.paymentDueDay,
    notes: data.notes,
    tenantIds: original.tenantIds,
    primaryTenantId: original.primaryTenantId,
    renewedFromLeaseId: leaseId,
    createdAt: now,
    updatedAt: now,
  }
  mockLeases = [...mockLeases, seed]
  return buildLease(seed)
}

export const terminateLease = async (
  leaseId: string,
  data: TerminateLeaseRequest
): Promise<Lease | null> => {
  // In real API, data.reason and data.terminationDate are sent to the server
  void data
  await delay(MOCK_DELAY_MS)
  const index = mockLeases.findIndex((l) => l.id === leaseId)
  if (index === -1) return null

  const updated: SeedLease = {
    ...mockLeases[index],
    baseStatus: "terminated",
    updatedAt: new Date().toISOString(),
  }
  mockLeases = mockLeases.map((l) => (l.id === leaseId ? updated : l))
  return buildLease(updated)
}

// ─── Lookup helpers for lease form ──────────────────────────────────────────

export const getPropertyOptions = () =>
  PROPERTY_OPTIONS.map((p) => ({ value: p.id, label: p.name }))

export const getUnitOptionsForProperty = (propertyId: string) =>
  UNIT_OPTIONS.filter(
    (u) =>
      u.propertyId === propertyId &&
      (u.status === "vacant" || u.status === "listed")
  ).map((u) => ({ value: u.id, label: u.label }))

export const getTenantOptions = () =>
  TENANT_OPTIONS.map((t) => ({ value: t.id, label: t.fullName }))
