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
  emergencyContact?: string
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
  leaseHistory: TenantLeaseEntry[]
}

export type TenantLeaseEntry = {
  leaseId: string
  unitLabel: string
  propertyName: string
  startDate: string
  endDate: string
  monthlyRent: number
  status: string
}

export type InviteTenantRequest = {
  email: string
  fullName: string
  phone?: string
}

export type UpdateTenantRequest = {
  fullName: string
  phone?: string
  emergencyContact?: string
}
