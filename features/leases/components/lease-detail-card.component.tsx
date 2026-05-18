import { DateRangeDisplay } from "@/shared/components/date-range-display.component"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import type { LeaseDetail } from "@/shared/types/lease.types"

import { LeaseStatusBadge } from "./lease-status-badge.component"

type LeaseDetailCardProps = {
  lease: LeaseDetail
}

export const LeaseDetailCard = ({ lease }: LeaseDetailCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lease Terms</CardTitle>
          <LeaseStatusBadge status={lease.status} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            Property
          </span>
          <span className="text-sm">{lease.propertyName}</span>
        </div>

        <div className="grid gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            Unit
          </span>
          <span className="text-sm">{lease.unitLabel}</span>
        </div>

        <div className="grid gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            Lease Period
          </span>
          <DateRangeDisplay
            startDate={lease.startDate}
            endDate={lease.endDate}
            className="text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              Monthly Rent
            </span>
            <span className="text-sm">
              ${lease.monthlyRent.toLocaleString()}
            </span>
          </div>
          <div className="grid gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              Security Deposit
            </span>
            <span className="text-sm">
              ${lease.securityDeposit.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            Payment Due Day
          </span>
          <span className="text-sm">
            {lease.paymentDueDay}
            {getOrdinalSuffix(lease.paymentDueDay)} of each month
          </span>
        </div>

        {lease.notes && (
          <div className="grid gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              Notes
            </span>
            <span className="text-sm whitespace-pre-wrap">{lease.notes}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const ORDINAL_RULES: [number[], string][] = [
  // eslint-disable-next-line no-magic-numbers
  [[11, 12, 13], "th"],
]

function getOrdinalSuffix(day: number): string {
  for (const [teens, suffix] of ORDINAL_RULES) {
    if (teens.includes(day)) return suffix
  }
  // eslint-disable-next-line no-magic-numbers
  const lastDigit = day % 10
  if (lastDigit === 1) return "st"
  if (lastDigit === 2) return "nd"
  // eslint-disable-next-line no-magic-numbers
  if (lastDigit === 3) return "rd"
  return "th"
}
