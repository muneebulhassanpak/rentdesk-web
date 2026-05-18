import { StatusBadge } from "@/shared/components/status-badge.component"
import type { LeaseStatus } from "@/shared/types/lease.types"
import { LEASE_STATUS_LABELS } from "@/shared/types/lease.types"

type StatusBadgeVariant = "success" | "info" | "warning" | "purple" | "default"

const STATUS_VARIANT_MAP: Record<LeaseStatus, StatusBadgeVariant> = {
  draft: "info",
  active: "success",
  expiring_soon: "warning",
  expired: "default",
  terminated: "purple",
}

type LeaseStatusBadgeProps = {
  status: LeaseStatus
}

export const LeaseStatusBadge = ({ status }: LeaseStatusBadgeProps) => {
  return (
    <StatusBadge
      label={LEASE_STATUS_LABELS[status]}
      variant={STATUS_VARIANT_MAP[status]}
    />
  )
}
