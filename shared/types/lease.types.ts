export const LEASE_STATUSES = {
  DRAFT: "draft",
  ACTIVE: "active",
  EXPIRING_SOON: "expiring_soon",
  EXPIRED: "expired",
  TERMINATED: "terminated",
} as const

export type LeaseStatus = (typeof LEASE_STATUSES)[keyof typeof LEASE_STATUSES]

export const LEASE_STATUS_LABELS: Record<LeaseStatus, string> = {
  draft: "Draft",
  active: "Active",
  expiring_soon: "Expiring Soon",
  expired: "Expired",
  terminated: "Terminated",
}

export type LeaseTenant = {
  tenantId: string
  fullName: string
  email: string
  avatarUrl?: string
  isPrimary: boolean
}

export type Lease = {
  id: string
  orgId: string
  unitId: string
  propertyId: string
  status: LeaseStatus
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit: number
  paymentDueDay: number
  notes?: string
  renewedFromLeaseId?: string
  createdAt: string
  updatedAt: string
  // Joined fields for list view
  unitLabel: string
  propertyName: string
  tenants: LeaseTenant[]
}

export type LeaseDetail = Lease & {
  primaryTenant: LeaseTenant
}

export type CreateLeaseRequest = {
  propertyId: string
  unitId: string
  tenantIds: string[]
  primaryTenantId: string
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit: number
  paymentDueDay: number
  notes?: string
}

export type UpdateLeaseRequest = Partial<
  Omit<CreateLeaseRequest, "propertyId" | "unitId">
>

export type RenewLeaseRequest = {
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit: number
  paymentDueDay: number
  notes?: string
}

export type TerminateLeaseRequest = {
  terminationDate: string
  reason: string
  depositNotes?: string
}
