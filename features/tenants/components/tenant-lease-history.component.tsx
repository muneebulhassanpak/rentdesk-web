"use client"

import Link from "next/link"

import { FileText } from "lucide-react"

import { DateRangeDisplay } from "@/shared/components/date-range-display.component"
import { StatusBadge } from "@/shared/components/status-badge.component"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { LEASE_ROUTES } from "@/shared/constants/routes.constants"
import type { TenantLeaseEntry } from "@/shared/types/tenant.types"

type TenantLeaseHistoryProps = {
  entries: TenantLeaseEntry[]
}

const LEASE_STATUS_LABELS: Record<string, string> = {
  active: "Active",
  expiring_soon: "Expiring Soon",
  expired: "Expired",
  terminated: "Terminated",
  draft: "Draft",
}

const LEASE_STATUS_VARIANT_MAP: Record<
  string,
  "success" | "warning" | "default" | "purple" | "info"
> = {
  active: "success",
  expiring_soon: "warning",
  expired: "default",
  terminated: "purple",
  draft: "info",
}

export const TenantLeaseHistory = ({ entries }: TenantLeaseHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lease History</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No lease history
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.leaseId}
                className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="grid gap-1">
                  <Link
                    href={LEASE_ROUTES.DETAIL(entry.leaseId)}
                    className="font-medium text-primary hover:underline"
                  >
                    {entry.propertyName} &middot; Unit {entry.unitLabel}
                  </Link>
                  <DateRangeDisplay
                    startDate={entry.startDate}
                    endDate={entry.endDate}
                    className="text-sm text-muted-foreground"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    ${entry.monthlyRent.toLocaleString()}/mo
                  </span>
                  <StatusBadge
                    label={LEASE_STATUS_LABELS[entry.status] ?? entry.status}
                    variant={
                      LEASE_STATUS_VARIANT_MAP[entry.status] ?? "default"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
