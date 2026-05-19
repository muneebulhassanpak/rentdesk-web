import { StatusBadge } from "@/shared/components/status-badge.component"
import type { PaymentStatus } from "@/shared/types/payment.types"
import { PAYMENT_STATUS_LABELS } from "@/shared/types/payment.types"

type StatusBadgeVariant = "success" | "info" | "warning" | "purple" | "default"

const STATUS_VARIANT_MAP: Record<PaymentStatus, StatusBadgeVariant> = {
  scheduled: "info",
  due: "warning",
  paid: "success",
  late: "purple",
  partial: "warning",
  overpaid: "info",
  waived: "default",
}

type PaymentStatusBadgeProps = {
  status: PaymentStatus
}

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  return (
    <StatusBadge
      label={PAYMENT_STATUS_LABELS[status]}
      variant={STATUS_VARIANT_MAP[status]}
    />
  )
}
