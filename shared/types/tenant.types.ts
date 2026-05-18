export const TENANT_STATUSES = {
  INVITED: "invited",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const

export type TenantStatus =
  (typeof TENANT_STATUSES)[keyof typeof TENANT_STATUSES]

export const TENANT_STATUS_LABELS: Record<TenantStatus, string> = {
  invited: "Invited",
  active: "Active",
  inactive: "Inactive",
}

export type Tenant = {
  id: string
  orgId: string
  email: string
  fullName: string
  phone?: string
  avatarUrl?: string
  isActive: boolean
  status: TenantStatus
  lastActiveAt?: string
  createdAt: string
  updatedAt: string
  // Joined fields for list view
  currentUnitLabel?: string
  currentPropertyName?: string
  currentLeaseStatus?: string
}

export type TenantDetail = Tenant & {
  emergencyContactName?: string
  emergencyContactPhone?: string
  notes?: string
  leaseHistory: TenantLeaseEntry[]
}

export type TenantLeaseEntry = {
  id: string
  unitId: string
  propertyId: string
  startDate: string
  endDate: string
  monthlyRent: string
  status: string
}

export type InviteTenantRequest = {
  email: string
  fullName: string
  phone?: string
}

export type UpdateTenantRequest = {
  fullName?: string
  phone?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  notes?: string
}
