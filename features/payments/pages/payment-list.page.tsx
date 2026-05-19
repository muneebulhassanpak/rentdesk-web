"use client"

import { useCallback, useMemo, useState } from "react"

import { CreditCard } from "lucide-react"

import { DataTable } from "@/shared/components/data-table.component"
import { EmptyState } from "@/shared/components/empty-state.component"
import { MonthPicker } from "@/shared/components/month-picker.component"
import { PageHeader } from "@/shared/components/page-header.component"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { useAuth } from "@/shared/hooks/use-auth.hook"
import type { PaymentStatus } from "@/shared/types/payment.types"
import { PAYMENT_STATUS_LABELS } from "@/shared/types/payment.types"

import { paymentColumns } from "../components/payment-columns"
import { PaymentSummaryBar } from "../components/payment-summary-bar.component"
import {
  useCollectionSummary,
  usePayments,
  usePropertyOptions,
} from "../hooks/use-payments.hook"
import {
  ALL_PROPERTIES,
  ALL_STATUSES,
  getCurrentMonth,
  getMonthOptions,
} from "../utils/payment.utils"

export default function PaymentListPage() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES)
  const [propertyFilter, setPropertyFilter] = useState<string>(ALL_PROPERTIES)
  const [month, setMonth] = useState(getCurrentMonth())
  const [page, setPage] = useState(0)

  const monthOptions = useMemo(() => getMonthOptions(), [])

  const { data: result, isLoading } = usePayments(user?.orgId ?? "", {
    status:
      statusFilter !== ALL_STATUSES
        ? (statusFilter as PaymentStatus)
        : undefined,
    propertyId: propertyFilter !== ALL_PROPERTIES ? propertyFilter : undefined,
    month,
    page: page + 1,
  })

  const { data: summary } = useCollectionSummary(month)
  const { data: propertyOptions = [] } = usePropertyOptions()

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value)
    setPage(0)
  }, [])

  const handlePropertyFilterChange = useCallback((value: string) => {
    setPropertyFilter(value)
    setPage(0)
  }, [])

  const handleMonthChange = useCallback((value: string) => {
    setMonth(value)
    setPage(0)
  }, [])

  const payments = result?.data ?? []
  const totalPayments = result?.total ?? 0

  if (isLoading && !result) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["expected", "collected", "outstanding", "rate"].map((key) => (
            <div key={key} className="h-24 animate-pulse rounded bg-muted" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Payments"
        description={`${totalPayments} ${totalPayments === 1 ? "payment" : "payments"} this period`}
      />

      {summary && <PaymentSummaryBar summary={summary} />}

      {totalPayments === 0 &&
      statusFilter === ALL_STATUSES &&
      propertyFilter === ALL_PROPERTIES ? (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Payments will appear here once leases are active and rent is due."
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <MonthPicker
              value={month}
              onValueChange={handleMonthChange}
              options={monthOptions}
              className="w-48"
            />
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
                {(
                  Object.entries(PAYMENT_STATUS_LABELS) as [
                    PaymentStatus,
                    string,
                  ][]
                ).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={propertyFilter}
              onValueChange={handlePropertyFilterChange}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_PROPERTIES}>All properties</SelectItem>
                {propertyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DataTable
            columns={paymentColumns}
            data={payments}
            pageCount={result?.pageCount ?? 1}
            page={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
