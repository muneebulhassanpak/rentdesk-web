"use client"

import { CreditCard } from "lucide-react"

import { EmptyState } from "@/shared/components/empty-state.component"
import { PageHeader } from "@/shared/components/page-header.component"
import { useAuth } from "@/shared/hooks/use-auth.hook"

import { PayNowCard } from "../components/pay-now-card.component"
import { PaymentHistory } from "../components/payment-history.component"
import { useLeasePayments } from "../hooks/use-payments.hook"

export default function TenantPaymentsPage() {
  const { user } = useAuth()

  // Tenant's active lease ID comes from user context
  const leaseId = user?.leaseId ?? ""
  const { data: payments = [], isLoading } = useLeasePayments(leaseId)

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <PageHeader
          title="My Payments"
          description="View your payment history and make payments"
        />
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Payments will appear here once your lease is active."
        />
      </div>
    )
  }

  // Find current/upcoming payment (first due or late)
  const currentPayment = payments.find(
    (p) =>
      p.status === "due" ||
      p.status === "late" ||
      p.status === "partial" ||
      p.status === "scheduled"
  )

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="My Payments"
        description="View your payment history and make payments"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {currentPayment ? (
            <PayNowCard payment={currentPayment} />
          ) : (
            <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
              All payments up to date
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <PaymentHistory payments={payments} />
        </div>
      </div>
    </div>
  )
}
