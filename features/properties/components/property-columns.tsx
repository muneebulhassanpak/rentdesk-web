"use client"

import Link from "next/link"

import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import type { Property } from "@/shared/types/property.types"
import { PROPERTY_TYPE_LABELS } from "@/shared/types/property.types"

const SortableHeader = ({
  column,
  label,
}: {
  column: {
    toggleSorting: (desc?: boolean) => void
    getIsSorted: () => false | "asc" | "desc"
  }
  label: string
}) => (
  <Button
    variant="ghost"
    size="sm"
    className="-ml-3"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label}
    <ArrowUpDown className="ml-1 h-3 w-3" />
  </Button>
)

export const propertyColumns: ColumnDef<Property>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} label="Name" />,
    cell: ({ row }) => (
      <Link
        href={`/properties/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    id: "address",
    header: "Address",
    cell: ({ row }) => {
      const { address } = row.original
      return (
        <span className="text-muted-foreground">
          {[address.line1, address.city, address.state]
            .filter(Boolean)
            .join(", ")}
        </span>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => PROPERTY_TYPE_LABELS[row.original.type],
  },
  {
    accessorKey: "unitCount",
    header: ({ column }) => <SortableHeader column={column} label="Units" />,
  },
  {
    accessorKey: "occupancyPercent",
    header: ({ column }) => (
      <SortableHeader column={column} label="Occupancy" />
    ),
    cell: ({ row }) => `${row.getValue("occupancyPercent")}%`,
  },
  {
    accessorKey: "monthlyRentRoll",
    header: ({ column }) => (
      <SortableHeader column={column} label="Rent Roll" />
    ),
    cell: ({ row }) =>
      `$${(row.getValue("monthlyRentRoll") as number).toLocaleString()}`,
  },
  {
    accessorKey: "openTickets",
    header: "Tickets",
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
            <Link href={`/properties/${row.original.id}`}>View details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/properties/${row.original.id}/edit`}>
              <Pencil className="mr-2 h-3 w-3" />
              Edit
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
