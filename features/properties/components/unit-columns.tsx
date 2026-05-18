"use client"

import Link from "next/link"

import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import type { Unit } from "@/shared/types/property.types"

import { UnitStatusBadge } from "./unit-status-badge.component"

export const createUnitColumns = (propertyId: string): ColumnDef<Unit>[] => [
  {
    accessorKey: "label",
    header: "Unit",
    cell: ({ row }) => (
      <Link
        href={`/properties/${propertyId}/units/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("label")}
      </Link>
    ),
  },
  {
    id: "bedBath",
    header: "Bed / Bath",
    cell: ({ row }) => {
      const { bedrooms, bathrooms } = row.original
      if (bedrooms === undefined && bathrooms === undefined) return "—"
      return `${bedrooms ?? 0} / ${bathrooms ?? 0}`
    },
  },
  {
    accessorKey: "sqft",
    header: "Sqft",
    cell: ({ row }) => {
      const sqft = row.getValue("sqft") as number | undefined
      return sqft ? sqft.toLocaleString() : "—"
    },
  },
  {
    accessorKey: "monthlyRent",
    header: "Rent",
    cell: ({ row }) =>
      `$${(row.getValue("monthlyRent") as number).toLocaleString()}`,
  },
  {
    accessorKey: "securityDeposit",
    header: "Deposit",
    cell: ({ row }) =>
      `$${(row.getValue("securityDeposit") as number).toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <UnitStatusBadge status={row.original.status} />,
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
            <Link href={`/properties/${propertyId}/units/${row.original.id}`}>
              View details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/properties/${propertyId}/units/${row.original.id}/edit`}
            >
              <Pencil className="mr-2 h-3 w-3" />
              Edit
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
