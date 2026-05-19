"use client"

import Link from "next/link"

import { type ColumnDef } from "@tanstack/react-table"
import { Eye, MoreHorizontal, Receipt } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { PAYMENT_ROUTES } from "@/shared/constants/routes.constants"
import type { Payment } from "@/shared/types/payment.types"

import { formatCurrency } from "../utils/payment.utils"
import { PaymentStatusBadge } from "./payment-status-badge.component"

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    id: "tenant",
    header: "Tenant",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.tenantName}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.propertyName} — {row.original.unitLabel}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) =>
      new Date(row.original.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
  },
  {
    id: "amountDue",
    header: "Amount Due",
    cell: ({ row }) => formatCurrency(row.original.amountDue),
  },
  {
    id: "amountPaid",
    header: "Amount Paid",
    cell: ({ row }) => (
      <span
        className={
          row.original.amountPaid > 0
            ? "font-medium text-emerald-600"
            : "text-muted-foreground"
        }
      >
        {row.original.amountPaid > 0
          ? formatCurrency(row.original.amountPaid)
          : "\u2014"}
      </span>
    ),
  },
  {
    id: "lateFee",
    header: "Late Fee",
    cell: ({ row }) =>
      row.original.lateFee > 0 ? (
        <span className="text-red-600">
          {formatCurrency(row.original.lateFee)}
        </span>
      ) : (
        <span className="text-muted-foreground">{"\u2014"}</span>
      ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
      const canRecord =
        payment.status !== "paid" &&
        payment.status !== "waived" &&
        payment.status !== "overpaid"

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={PAYMENT_ROUTES.DETAIL(payment.id)}>
                <Eye className="mr-2 h-3 w-3" />
                View
              </Link>
            </DropdownMenuItem>
            {canRecord && (
              <DropdownMenuItem asChild>
                <Link href={PAYMENT_ROUTES.DETAIL(payment.id)}>
                  <Receipt className="mr-2 h-3 w-3" />
                  Record Payment
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
