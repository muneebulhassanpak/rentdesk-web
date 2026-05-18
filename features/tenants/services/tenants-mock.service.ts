import type { PaginatedResponse } from "@/shared/types/property.types"
import type {
  InviteTenantRequest,
  Tenant,
  TenantDetail,
  TenantLeaseEntry,
  TenantStatus,
  UpdateTenantRequest,
} from "@/shared/types/tenant.types"

const MOCK_ORG_ID = "org_oaktree_001"
const MOCK_DELAY_MS = 300
const UUID_SLICE_LENGTH = 8
const DEFAULT_PAGE_SIZE = 10

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── Seed: Tenants ──────────────────────────────────────────────────────────

const SEED_TENANTS: Tenant[] = [
  {
    id: "ten_001",
    orgId: MOCK_ORG_ID,
    email: "maria.santos@email.com",
    fullName: "Maria Santos",
    phone: "(555) 101-0001",
    status: "active",
    lastActiveAt: "2026-05-15",
    createdAt: "2024-06-15",
    updatedAt: "2026-05-15",
    currentUnitLabel: "1A",
    currentPropertyName: "12 Maple Street",
    currentLeaseStatus: "active",
  },
  {
    id: "ten_002",
    orgId: MOCK_ORG_ID,
    email: "james.chen@email.com",
    fullName: "James Chen",
    phone: "(555) 101-0002",
    status: "active",
    lastActiveAt: "2026-05-14",
    createdAt: "2024-06-15",
    updatedAt: "2026-05-14",
    currentUnitLabel: "1B",
    currentPropertyName: "12 Maple Street",
    currentLeaseStatus: "active",
  },
  {
    id: "ten_003",
    orgId: MOCK_ORG_ID,
    email: "aisha.johnson@email.com",
    fullName: "Aisha Johnson",
    phone: "(555) 101-0003",
    emergencyContact: "Robert Johnson – (555) 202-0003",
    status: "active",
    lastActiveAt: "2026-05-16",
    createdAt: "2024-07-01",
    updatedAt: "2026-05-16",
    currentUnitLabel: "2B",
    currentPropertyName: "12 Maple Street",
    currentLeaseStatus: "expiring_soon",
  },
  {
    id: "ten_004",
    orgId: MOCK_ORG_ID,
    email: "david.kim@email.com",
    fullName: "David Kim",
    phone: "(555) 101-0004",
    status: "active",
    lastActiveAt: "2026-05-10",
    createdAt: "2024-04-01",
    updatedAt: "2026-05-10",
    currentUnitLabel: "Main",
    currentPropertyName: "45 Oak Avenue",
    currentLeaseStatus: "active",
  },
  {
    id: "ten_005",
    orgId: MOCK_ORG_ID,
    email: "sarah.patel@email.com",
    fullName: "Sarah Patel",
    phone: "(555) 101-0005",
    emergencyContact: "Raj Patel – (555) 202-0005",
    status: "active",
    lastActiveAt: "2026-05-17",
    createdAt: "2024-02-01",
    updatedAt: "2026-05-17",
    currentUnitLabel: "101",
    currentPropertyName: "Riverside Condos",
    currentLeaseStatus: "active",
  },
  {
    id: "ten_006",
    orgId: MOCK_ORG_ID,
    email: "michael.oconnor@email.com",
    fullName: "Michael O'Connor",
    phone: "(555) 101-0006",
    status: "active",
    lastActiveAt: "2026-05-12",
    createdAt: "2024-02-15",
    updatedAt: "2026-05-12",
    currentUnitLabel: "102",
    currentPropertyName: "Riverside Condos",
    currentLeaseStatus: "active",
  },
  {
    id: "ten_007",
    orgId: MOCK_ORG_ID,
    email: "elena.rodriguez@email.com",
    fullName: "Elena Rodriguez",
    phone: "(555) 101-0007",
    status: "active",
    lastActiveAt: "2026-05-18",
    createdAt: "2024-03-01",
    updatedAt: "2026-05-18",
    currentUnitLabel: "202",
    currentPropertyName: "Riverside Condos",
    currentLeaseStatus: "expiring_soon",
  },
  {
    id: "ten_008",
    orgId: MOCK_ORG_ID,
    email: "marcus.wright@email.com",
    fullName: "Marcus Wright",
    phone: "(555) 101-0008",
    status: "active",
    lastActiveAt: "2026-05-11",
    createdAt: "2024-03-01",
    updatedAt: "2026-05-11",
    currentUnitLabel: "202",
    currentPropertyName: "Riverside Condos",
    currentLeaseStatus: "expiring_soon",
  },
  {
    id: "ten_009",
    orgId: MOCK_ORG_ID,
    email: "lisa.nguyen@email.com",
    fullName: "Lisa Nguyen",
    phone: "(555) 101-0009",
    status: "active",
    lastActiveAt: "2026-05-09",
    createdAt: "2024-04-15",
    updatedAt: "2026-05-09",
    currentUnitLabel: "302",
    currentPropertyName: "Riverside Condos",
    currentLeaseStatus: "active",
  },
  {
    id: "ten_010",
    orgId: MOCK_ORG_ID,
    email: "tom.baker@email.com",
    fullName: "Tom Baker",
    phone: "(555) 101-0010",
    emergencyContact: "Jane Baker – (555) 202-0010",
    status: "active",
    lastActiveAt: "2026-05-13",
    createdAt: "2024-06-01",
    updatedAt: "2026-05-13",
    currentUnitLabel: "Main",
    currentPropertyName: "78 Pine Road",
    currentLeaseStatus: "active",
  },
  {
    id: "ten_011",
    orgId: MOCK_ORG_ID,
    email: "priya.sharma@email.com",
    fullName: "Priya Sharma",
    status: "invited",
    createdAt: "2026-05-10",
    updatedAt: "2026-05-10",
  },
  {
    id: "ten_012",
    orgId: MOCK_ORG_ID,
    email: "kevin.murphy@email.com",
    fullName: "Kevin Murphy",
    status: "invited",
    createdAt: "2026-05-12",
    updatedAt: "2026-05-12",
  },
  {
    id: "ten_013",
    orgId: MOCK_ORG_ID,
    email: "claudia.ferreira@email.com",
    fullName: "Claudia Ferreira",
    phone: "(555) 101-0013",
    status: "inactive",
    lastActiveAt: "2025-12-01",
    createdAt: "2024-01-15",
    updatedAt: "2025-12-01",
  },
]

// ─── Mock lease history for tenant detail ─────────────────────────────────────

const MOCK_LEASE_HISTORY: Record<string, TenantLeaseEntry[]> = {
  ten_001: [
    {
      leaseId: "lease_001",
      unitLabel: "1A",
      propertyName: "12 Maple Street",
      startDate: "2025-07-01",
      endDate: "2026-06-30",
      monthlyRent: 1200,
      status: "active",
    },
  ],
  ten_003: [
    {
      leaseId: "lease_003",
      unitLabel: "2B",
      propertyName: "12 Maple Street",
      startDate: "2025-07-01",
      endDate: "2026-07-15",
      monthlyRent: 1650,
      status: "expiring_soon",
    },
    {
      leaseId: "lease_old_001",
      unitLabel: "1A",
      propertyName: "12 Maple Street",
      startDate: "2024-07-01",
      endDate: "2025-06-30",
      monthlyRent: 1150,
      status: "expired",
    },
  ],
  ten_005: [
    {
      leaseId: "lease_005",
      unitLabel: "101",
      propertyName: "Riverside Condos",
      startDate: "2025-03-01",
      endDate: "2026-02-28",
      monthlyRent: 1100,
      status: "active",
    },
  ],
  ten_007: [
    {
      leaseId: "lease_007",
      unitLabel: "202",
      propertyName: "Riverside Condos",
      startDate: "2025-04-01",
      endDate: "2026-07-01",
      monthlyRent: 1800,
      status: "expiring_soon",
    },
  ],
  ten_010: [
    {
      leaseId: "lease_010",
      unitLabel: "Main",
      propertyName: "78 Pine Road",
      startDate: "2025-06-01",
      endDate: "2026-05-31",
      monthlyRent: 3200,
      status: "active",
    },
    {
      leaseId: "lease_old_002",
      unitLabel: "Main",
      propertyName: "78 Pine Road",
      startDate: "2024-06-01",
      endDate: "2025-05-31",
      monthlyRent: 3000,
      status: "expired",
    },
  ],
  ten_013: [
    {
      leaseId: "lease_old_003",
      unitLabel: "301",
      propertyName: "Riverside Condos",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
      monthlyRent: 2100,
      status: "expired",
    },
  ],
}

// ─── Mutable mock array ─────────────────────────────────────────────────────

let mockTenants: Tenant[] = [...SEED_TENANTS]

// ─── Service functions ──────────────────────────────────────────────────────

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
  await delay(MOCK_DELAY_MS)
  const {
    search,
    status = "all",
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = params

  let filtered = [...mockTenants]

  if (status !== "all") {
    filtered = filtered.filter((t) => t.status === status)
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.fullName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
    )
  }

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  return { data: paged, total, page, pageSize, pageCount }
}

export const getTenant = async (
  tenantId: string
): Promise<TenantDetail | null> => {
  await delay(MOCK_DELAY_MS)
  const found = mockTenants.find((t) => t.id === tenantId)
  if (!found) return null
  return {
    ...found,
    leaseHistory: MOCK_LEASE_HISTORY[tenantId] ?? [],
  }
}

export const createTenant = async (
  data: InviteTenantRequest
): Promise<Tenant> => {
  await delay(MOCK_DELAY_MS)
  const now = new Date().toISOString()
  const newTenant: Tenant = {
    id: `ten_${crypto.randomUUID().slice(0, UUID_SLICE_LENGTH)}`,
    orgId: MOCK_ORG_ID,
    ...data,
    status: "invited",
    createdAt: now,
    updatedAt: now,
  }
  mockTenants = [...mockTenants, newTenant]
  return newTenant
}

export const updateTenant = async (
  tenantId: string,
  data: UpdateTenantRequest
): Promise<Tenant | null> => {
  await delay(MOCK_DELAY_MS)
  const index = mockTenants.findIndex((t) => t.id === tenantId)
  if (index === -1) return null

  const updated: Tenant = {
    ...mockTenants[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  mockTenants = mockTenants.map((t) => (t.id === tenantId ? updated : t))
  return updated
}

export const deactivateTenant = async (
  tenantId: string
): Promise<Tenant | null> => {
  await delay(MOCK_DELAY_MS)
  const index = mockTenants.findIndex((t) => t.id === tenantId)
  if (index === -1) return null

  const updated: Tenant = {
    ...mockTenants[index],
    status: "inactive",
    updatedAt: new Date().toISOString(),
  }
  mockTenants = mockTenants.map((t) => (t.id === tenantId ? updated : t))
  return updated
}
