"use client"

import Link from "next/link"

import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil } from "lucide-react"

import { StatusBadge } from "@/shared/components/status-badge.component"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { UserAvatar } from "@/shared/components/user-avatar.component"
import { TENANT_ROUTES } from "@/shared/constants/routes.constants"
import type { Tenant, TenantStatus } from "@/shared/types/tenant.types"
import { TENANT_STATUS_LABELS } from "@/shared/types/tenant.types"

const STATUS_VARIANT_MAP: Record<TenantStatus, "success" | "info" | "default"> =
  {
    active: "success",
    invited: "info",
    inactive: "default",
  }

export const tenantColumns: ColumnDef<Tenant>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={TENANT_ROUTES.DETAIL(row.original.id)}
        className="flex items-center gap-2 font-medium text-primary hover:underline"
      >
        <UserAvatar
          fullName={row.original.fullName}
          avatarUrl={row.original.avatarUrl}
          size="sm"
        />
        {row.original.fullName}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.phone ?? "\u2014"}
      </span>
    ),
  },
  {
    id: "unit",
    header: "Unit",
    cell: ({ row }) => {
      const { currentPropertyName, currentUnitLabel } = row.original
      if (!currentPropertyName || !currentUnitLabel) {
        return <span className="text-muted-foreground">{"\u2014"}</span>
      }
      return (
        <span className="text-muted-foreground">
          {currentPropertyName} &middot; {currentUnitLabel}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        label={TENANT_STATUS_LABELS[row.original.status]}
        variant={STATUS_VARIANT_MAP[row.original.status]}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={TENANT_ROUTES.DETAIL(row.original.id)}>
              View details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={TENANT_ROUTES.EDIT(row.original.id)}>
              <Pencil className="mr-2 h-3 w-3" />
              Edit
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
