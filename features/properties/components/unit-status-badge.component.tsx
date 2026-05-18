import { StatusBadge } from "@/shared/components/status-badge.component"
import type { UnitStatus } from "@/shared/types/property.types"
import { UNIT_STATUS_LABELS } from "@/shared/types/property.types"

const STATUS_VARIANT: Record<
  UnitStatus,
  "success" | "info" | "warning" | "purple"
> = {
  vacant: "success",
  occupied: "info",
  under_maintenance: "warning",
  listed: "purple",
}

type UnitStatusBadgeProps = {
  status: UnitStatus
}

export const UnitStatusBadge = ({ status }: UnitStatusBadgeProps) => {
  return (
    <StatusBadge
      label={UNIT_STATUS_LABELS[status]}
      variant={STATUS_VARIANT[status]}
    />
  )
}
