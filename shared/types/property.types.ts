export const PROPERTY_TYPES = {
  SINGLE_FAMILY: "single_family",
  MULTI_UNIT: "multi_unit",
  CONDO: "condo",
  COMMERCIAL: "commercial",
} as const

export type PropertyType = (typeof PROPERTY_TYPES)[keyof typeof PROPERTY_TYPES]

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  single_family: "Single Family",
  multi_unit: "Multi-Unit",
  condo: "Condo",
  commercial: "Commercial",
}

export const UNIT_STATUSES = {
  VACANT: "vacant",
  OCCUPIED: "occupied",
  UNDER_MAINTENANCE: "under_maintenance",
  LISTED: "listed",
} as const

export type UnitStatus = (typeof UNIT_STATUSES)[keyof typeof UNIT_STATUSES]

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  vacant: "Vacant",
  occupied: "Occupied",
  under_maintenance: "Maintenance",
  listed: "Listed",
}

export type Address = {
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode?: string
  country: string
}

export type Property = {
  id: string
  orgId: string
  name: string
  type: PropertyType
  address: Address
  coverPhotoUrl?: string
  yearBuilt?: number
  notes?: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  // Computed/joined fields
  unitCount: number
  occupiedCount: number
  vacantCount: number
  maintenanceCount: number
  occupancyPercent: number
  monthlyRentRoll: number
  openTickets: number
}

export type Unit = {
  id: string
  propertyId: string
  orgId: string
  label: string
  bedrooms?: number
  bathrooms?: number
  sqft?: number
  monthlyRent: number
  securityDeposit: number
  status: UnitStatus
  description?: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export type CreatePropertyRequest = {
  name: string
  type: PropertyType
  address: Address
  coverPhotoUrl?: string
  yearBuilt?: number
  notes?: string
}

export type UpdatePropertyRequest = Partial<CreatePropertyRequest>

export type CreateUnitRequest = {
  propertyId: string
  label: string
  bedrooms?: number
  bathrooms?: number
  sqft?: number
  monthlyRent: number
  securityDeposit: number
  status: UnitStatus
  description?: string
}

export type UpdateUnitRequest = Partial<Omit<CreateUnitRequest, "propertyId">>
