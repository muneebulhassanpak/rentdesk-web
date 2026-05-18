"use client"

import Link from "next/link"

import { type ColumnDef } from "@tanstack/react-table"
import { Eye, MoreHorizontal, Pencil, RefreshCw } from "lucide-react"

import { DateRangeDisplay } from "@/shared/components/date-range-display.component"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { UserAvatar } from "@/shared/components/user-avatar.component"
import { LEASE_ROUTES } from "@/shared/constants/routes.constants"
import type { Lease } from "@/shared/types/lease.types"

import { LeaseStatusBadge } from "./lease-status-badge.component"

export const leaseColumns: ColumnDef<Lease>[] = [
  {
    id: "unit",
    header: "Unit",
    cell: ({ row }) => (
      <Link
        href={LEASE_ROUTES.DETAIL(row.original.id)}
        className="font-medium text-primary hover:underline"
      >
        <div>{row.original.propertyName}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.unitLabel}
        </div>
      </Link>
    ),
  },
  {
    id: "tenants",
    header: "Tenant(s)",
    cell: ({ row }) => {
      const primary = row.original.tenants.find((t) => t.isPrimary)
      const coTenantCount = row.original.tenants.length - 1

      if (!primary) return <span className="text-muted-foreground">--</span>

      return (
        <div className="flex items-center gap-2">
          <UserAvatar
            fullName={primary.fullName}
            avatarUrl={primary.avatarUrl}
            size="sm"
          />
          <span className="text-sm">{primary.fullName}</span>
          {coTenantCount > 0 && (
            <span className="text-xs text-muted-foreground">
              +{coTenantCount}
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: "dates",
    header: "Dates",
    cell: ({ row }) => (
      <DateRangeDisplay
        startDate={row.original.startDate}
        endDate={row.original.endDate}
        className="text-sm text-muted-foreground"
      />
    ),
  },
  {
    accessorKey: "monthlyRent",
    header: "Rent",
    cell: ({ row }) =>
      `$${(row.getValue("monthlyRent") as number).toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <LeaseStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lease = row.original
      const isDraft = lease.status === "draft"
      const isRenewable =
        lease.status === "active" || lease.status === "expiring_soon"

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={LEASE_ROUTES.DETAIL(lease.id)}>
                <Eye className="mr-2 h-3 w-3" />
                View
              </Link>
            </DropdownMenuItem>
            {isDraft && (
              <DropdownMenuItem asChild>
                <Link href={LEASE_ROUTES.EDIT(lease.id)}>
                  <Pencil className="mr-2 h-3 w-3" />
                  Edit
                </Link>
              </DropdownMenuItem>
            )}
            {isRenewable && (
              <DropdownMenuItem asChild>
                <Link href={LEASE_ROUTES.RENEW(lease.id)}>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Renew
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
