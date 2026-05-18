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

const MOCK_ORG_ID = "org_oaktree_001"
const MOCK_DELAY_MS = 300
const UUID_SLICE_LENGTH = 8
const PERCENT = 100
const DEFAULT_PAGE_SIZE = 10

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── Seed: Units ──────────────────────────────────────────────────────────────

const SEED_UNITS: Unit[] = [
  // 12 Maple Street (multi_unit) — 4 units
  {
    id: "unit_001",
    propertyId: "prop_001",
    orgId: MOCK_ORG_ID,
    label: "1A",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    monthlyRent: 1200,
    securityDeposit: 1200,
    status: "occupied",
    description: "Ground floor studio with patio",
    isArchived: false,
    createdAt: "2024-06-01",
    updatedAt: "2024-12-15",
  },
  {
    id: "unit_002",
    propertyId: "prop_001",
    orgId: MOCK_ORG_ID,
    label: "1B",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 700,
    monthlyRent: 1250,
    securityDeposit: 1250,
    status: "occupied",
    description: "Ground floor one-bedroom",
    isArchived: false,
    createdAt: "2024-06-01",
    updatedAt: "2024-11-01",
  },
  {
    id: "unit_003",
    propertyId: "prop_001",
    orgId: MOCK_ORG_ID,
    label: "2A",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 900,
    monthlyRent: 1600,
    securityDeposit: 1600,
    status: "vacant",
    description: "Second floor two-bedroom, recently renovated",
    isArchived: false,
    createdAt: "2024-06-01",
    updatedAt: "2025-01-10",
  },
  {
    id: "unit_004",
    propertyId: "prop_001",
    orgId: MOCK_ORG_ID,
    label: "2B",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 950,
    monthlyRent: 1650,
    securityDeposit: 1650,
    status: "occupied",
    description: "Second floor corner unit with extra closet",
    isArchived: false,
    createdAt: "2024-06-01",
    updatedAt: "2024-10-01",
  },

  // 45 Oak Avenue (single_family) — 1 unit
  {
    id: "unit_005",
    propertyId: "prop_002",
    orgId: MOCK_ORG_ID,
    label: "Main",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    monthlyRent: 2800,
    securityDeposit: 2800,
    status: "occupied",
    description: "Single family home with garage and backyard",
    isArchived: false,
    createdAt: "2024-03-15",
    updatedAt: "2024-09-01",
  },

  // Riverside Condos (condo) — 6 units
  {
    id: "unit_006",
    propertyId: "prop_003",
    orgId: MOCK_ORG_ID,
    label: "101",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 550,
    monthlyRent: 1100,
    securityDeposit: 1100,
    status: "occupied",
    description: "First floor condo with pool access",
    isArchived: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-08-15",
  },
  {
    id: "unit_007",
    propertyId: "prop_003",
    orgId: MOCK_ORG_ID,
    label: "102",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 580,
    monthlyRent: 1150,
    securityDeposit: 1150,
    status: "occupied",
    description: "First floor unit near gym",
    isArchived: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-07-01",
  },
  {
    id: "unit_008",
    propertyId: "prop_003",
    orgId: MOCK_ORG_ID,
    label: "201",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 850,
    monthlyRent: 1750,
    securityDeposit: 1750,
    status: "under_maintenance",
    description: "Plumbing repair in progress",
    isArchived: false,
    createdAt: "2024-01-10",
    updatedAt: "2025-02-01",
  },
  {
    id: "unit_009",
    propertyId: "prop_003",
    orgId: MOCK_ORG_ID,
    label: "202",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 880,
    monthlyRent: 1800,
    securityDeposit: 1800,
    status: "occupied",
    description: "Second floor corner with balcony",
    isArchived: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-06-01",
  },
  {
    id: "unit_010",
    propertyId: "prop_003",
    orgId: MOCK_ORG_ID,
    label: "301",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1100,
    monthlyRent: 2200,
    securityDeposit: 2200,
    status: "vacant",
    description: "Top floor penthouse with city view",
    isArchived: false,
    createdAt: "2024-01-10",
    updatedAt: "2025-01-20",
  },
  {
    id: "unit_011",
    propertyId: "prop_003",
    orgId: MOCK_ORG_ID,
    label: "302",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1050,
    monthlyRent: 2100,
    securityDeposit: 2100,
    status: "occupied",
    description: "Top floor unit with rooftop access",
    isArchived: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-05-01",
  },

  // 78 Pine Road (single_family) — 1 unit
  {
    id: "unit_012",
    propertyId: "prop_004",
    orgId: MOCK_ORG_ID,
    label: "Main",
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 2200,
    monthlyRent: 3200,
    securityDeposit: 3200,
    status: "occupied",
    description: "Large family home with finished basement",
    isArchived: false,
    createdAt: "2024-05-20",
    updatedAt: "2024-10-15",
  },

  // Commerce Plaza (commercial) — 6 units
  {
    id: "unit_013",
    propertyId: "prop_005",
    orgId: MOCK_ORG_ID,
    label: "Suite A",
    bedrooms: 0,
    bathrooms: 1,
    sqft: 1200,
    monthlyRent: 2500,
    securityDeposit: 5000,
    status: "occupied",
    description: "Ground floor retail space",
    isArchived: false,
    createdAt: "2024-02-01",
    updatedAt: "2024-08-01",
  },
  {
    id: "unit_014",
    propertyId: "prop_005",
    orgId: MOCK_ORG_ID,
    label: "Suite B",
    bedrooms: 0,
    bathrooms: 1,
    sqft: 800,
    monthlyRent: 1800,
    securityDeposit: 3600,
    status: "vacant",
    description: "Ground floor retail, former coffee shop",
    isArchived: false,
    createdAt: "2024-02-01",
    updatedAt: "2025-01-05",
  },
  {
    id: "unit_015",
    propertyId: "prop_005",
    orgId: MOCK_ORG_ID,
    label: "Suite C",
    bedrooms: 0,
    bathrooms: 2,
    sqft: 2000,
    monthlyRent: 3500,
    securityDeposit: 7000,
    status: "occupied",
    description: "Large ground floor space with loading dock",
    isArchived: false,
    createdAt: "2024-02-01",
    updatedAt: "2024-07-15",
  },
  {
    id: "unit_016",
    propertyId: "prop_005",
    orgId: MOCK_ORG_ID,
    label: "Office 201",
    bedrooms: 0,
    bathrooms: 1,
    sqft: 600,
    monthlyRent: 1400,
    securityDeposit: 2800,
    status: "under_maintenance",
    description: "HVAC replacement scheduled",
    isArchived: false,
    createdAt: "2024-02-01",
    updatedAt: "2025-02-10",
  },
  {
    id: "unit_017",
    propertyId: "prop_005",
    orgId: MOCK_ORG_ID,
    label: "Office 202",
    bedrooms: 0,
    bathrooms: 1,
    sqft: 650,
    monthlyRent: 1500,
    securityDeposit: 3000,
    status: "occupied",
    description: "Second floor office with view",
    isArchived: false,
    createdAt: "2024-02-01",
    updatedAt: "2024-09-01",
  },
  {
    id: "unit_018",
    propertyId: "prop_005",
    orgId: MOCK_ORG_ID,
    label: "Office 203",
    bedrooms: 0,
    bathrooms: 1,
    sqft: 700,
    monthlyRent: 1600,
    securityDeposit: 3200,
    status: "listed",
    description: "Corner office, freshly painted, ready for move-in",
    isArchived: false,
    createdAt: "2024-02-01",
    updatedAt: "2025-02-15",
  },
]

// ─── Helper: compute property stats from units ───────────────────────────────

const computePropertyStats = (propertyId: string) => {
  const propertyUnits = mockUnits.filter(
    (u) => u.propertyId === propertyId && !u.isArchived
  )
  const unitCount = propertyUnits.length
  const occupiedCount = propertyUnits.filter(
    (u) => u.status === "occupied"
  ).length
  const vacantCount = propertyUnits.filter((u) => u.status === "vacant").length
  const maintenanceCount = propertyUnits.filter(
    (u) => u.status === "under_maintenance"
  ).length
  const occupancyPercent =
    unitCount > 0 ? Math.round((occupiedCount / unitCount) * PERCENT) : 0
  const monthlyRentRoll = propertyUnits
    .filter((u) => u.status === "occupied")
    .reduce((sum, u) => sum + u.monthlyRent, 0)

  return {
    unitCount,
    occupiedCount,
    vacantCount,
    maintenanceCount,
    occupancyPercent,
    monthlyRentRoll,
  }
}

// ─── Seed: Properties ─────────────────────────────────────────────────────────

const SEED_PROPERTIES: Omit<
  Property,
  | "unitCount"
  | "occupiedCount"
  | "vacantCount"
  | "maintenanceCount"
  | "occupancyPercent"
  | "monthlyRentRoll"
  | "openTickets"
>[] = [
  {
    id: "prop_001",
    orgId: MOCK_ORG_ID,
    name: "12 Maple Street",
    type: "multi_unit",
    address: {
      line1: "12 Maple Street",
      city: "Springfield",
      state: "IL",
      postalCode: "62704",
      country: "US",
    },
    yearBuilt: 1985,
    notes: "Recently renovated common areas. New roof in 2023.",
    isArchived: false,
    createdAt: "2024-06-01",
    updatedAt: "2025-01-15",
  },
  {
    id: "prop_002",
    orgId: MOCK_ORG_ID,
    name: "45 Oak Avenue",
    type: "single_family",
    address: {
      line1: "45 Oak Avenue",
      city: "Springfield",
      state: "IL",
      postalCode: "62701",
      country: "US",
    },
    yearBuilt: 1998,
    notes: "Corner lot, great curb appeal.",
    isArchived: false,
    createdAt: "2024-03-15",
    updatedAt: "2024-09-01",
  },
  {
    id: "prop_003",
    orgId: MOCK_ORG_ID,
    name: "Riverside Condos",
    type: "condo",
    address: {
      line1: "200 River Drive",
      line2: "Building C",
      city: "Springfield",
      state: "IL",
      postalCode: "62703",
      country: "US",
    },
    yearBuilt: 2010,
    notes: "HOA manages exterior and pool. We manage interior + tenants.",
    isArchived: false,
    createdAt: "2024-01-10",
    updatedAt: "2025-02-01",
  },
  {
    id: "prop_004",
    orgId: MOCK_ORG_ID,
    name: "78 Pine Road",
    type: "single_family",
    address: {
      line1: "78 Pine Road",
      city: "Springfield",
      state: "IL",
      postalCode: "62702",
      country: "US",
    },
    yearBuilt: 2005,
    notes: "Long-term tenant since 2020. Lease renews annually.",
    isArchived: false,
    createdAt: "2024-05-20",
    updatedAt: "2024-10-15",
  },
  {
    id: "prop_005",
    orgId: MOCK_ORG_ID,
    name: "Commerce Plaza",
    type: "commercial",
    address: {
      line1: "500 Commerce Blvd",
      city: "Springfield",
      state: "IL",
      postalCode: "62711",
      country: "US",
    },
    yearBuilt: 2015,
    notes:
      "Mixed retail and office. Ground floor retail, second floor offices.",
    isArchived: false,
    createdAt: "2024-02-01",
    updatedAt: "2025-02-15",
  },
]

// Manager is assigned to properties 1, 3, 5
const MANAGER_ASSIGNED_PROPERTY_IDS = ["prop_001", "prop_003", "prop_005"]

// Mock open tickets per property
const MOCK_OPEN_TICKETS: Record<string, number> = {
  prop_001: 1,
  prop_002: 0,
  prop_003: 3,
  prop_004: 0,
  prop_005: 2,
}

// ─── Mutable mock arrays ──────────────────────────────────────────────────────

let mockUnits: Unit[] = [...SEED_UNITS]

const buildProperty = (p: (typeof SEED_PROPERTIES)[number]): Property => {
  const stats = computePropertyStats(p.id)
  return {
    ...p,
    ...stats,
    openTickets: MOCK_OPEN_TICKETS[p.id] ?? 0,
  }
}

let mockProperties: (typeof SEED_PROPERTIES)[number][] = [...SEED_PROPERTIES]

// ─── Service functions ────────────────────────────────────────────────────────

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
  await delay(MOCK_DELAY_MS)
  const { role, search, type, page = 1, pageSize = DEFAULT_PAGE_SIZE } = params

  let filtered = mockProperties.filter((p) => !p.isArchived)

  if (role === "manager") {
    filtered = filtered.filter((p) =>
      MANAGER_ASSIGNED_PROPERTY_IDS.includes(p.id)
    )
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.line1.toLowerCase().includes(q) ||
        p.address.city.toLowerCase().includes(q)
    )
  }

  if (type) {
    filtered = filtered.filter((p) => p.type === type)
  }

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  return {
    data: paged.map(buildProperty),
    total,
    page,
    pageSize,
    pageCount,
  }
}

export const getProperty = async (
  propertyId: string
): Promise<Property | null> => {
  await delay(MOCK_DELAY_MS)
  const found = mockProperties.find((p) => p.id === propertyId && !p.isArchived)
  return found ? buildProperty(found) : null
}

export const createProperty = async (
  data: CreatePropertyRequest
): Promise<Property> => {
  await delay(MOCK_DELAY_MS)
  const now = new Date().toISOString()
  const newProp: (typeof SEED_PROPERTIES)[number] = {
    id: `prop_${crypto.randomUUID().slice(0, UUID_SLICE_LENGTH)}`,
    orgId: MOCK_ORG_ID,
    ...data,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  }
  mockProperties = [...mockProperties, newProp]
  return buildProperty(newProp)
}

export const updateProperty = async (
  propertyId: string,
  data: UpdatePropertyRequest
): Promise<Property | null> => {
  await delay(MOCK_DELAY_MS)
  const index = mockProperties.findIndex((p) => p.id === propertyId)
  if (index === -1) return null

  const updated = {
    ...mockProperties[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  mockProperties = mockProperties.map((p) =>
    p.id === propertyId ? updated : p
  )
  return buildProperty(updated)
}

export const archiveProperty = async (propertyId: string): Promise<boolean> => {
  await delay(MOCK_DELAY_MS)
  const index = mockProperties.findIndex((p) => p.id === propertyId)
  if (index === -1) return false

  mockProperties = mockProperties.map((p) =>
    p.id === propertyId
      ? { ...p, isArchived: true, updatedAt: new Date().toISOString() }
      : p
  )
  return true
}

export const getUnits = async (propertyId: string): Promise<Unit[]> => {
  await delay(MOCK_DELAY_MS)
  return mockUnits.filter((u) => u.propertyId === propertyId && !u.isArchived)
}

export const getUnit = async (unitId: string): Promise<Unit | null> => {
  await delay(MOCK_DELAY_MS)
  return mockUnits.find((u) => u.id === unitId && !u.isArchived) ?? null
}

export const createUnit = async (data: CreateUnitRequest): Promise<Unit> => {
  await delay(MOCK_DELAY_MS)
  const now = new Date().toISOString()
  const newUnit: Unit = {
    id: `unit_${crypto.randomUUID().slice(0, UUID_SLICE_LENGTH)}`,
    orgId: MOCK_ORG_ID,
    ...data,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  }
  mockUnits = [...mockUnits, newUnit]
  return newUnit
}

export const updateUnit = async (
  unitId: string,
  data: UpdateUnitRequest
): Promise<Unit | null> => {
  await delay(MOCK_DELAY_MS)
  const index = mockUnits.findIndex((u) => u.id === unitId)
  if (index === -1) return null

  const updated: Unit = {
    ...mockUnits[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  mockUnits = mockUnits.map((u) => (u.id === unitId ? updated : u))
  return updated
}
