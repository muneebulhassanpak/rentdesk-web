"use client"

import { useCallback, useState } from "react"

import { Ban, Receipt, ShieldOff } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/shared/components/page-header.component"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { PAYMENT_ROUTES } from "@/shared/constants/routes.constants"

import { PaymentDetailCard } from "../components/payment-detail-card.component"
import { PaymentTimeline } from "../components/payment-timeline.component"
import { RecordPaymentDialog } from "../components/record-payment-dialog.component"
import {
  usePayment,
  useWaiveLateFee,
  useWaivePayment,
} from "../hooks/use-payments.hook"
import { formatCurrency } from "../utils/payment.utils"

type PaymentDetailPageProps = {
  paymentId: string
}

export default function PaymentDetailPage({
  paymentId,
}: PaymentDetailPageProps) {
  const { data: payment, isLoading } = usePayment(paymentId)
  const waiveMutation = useWaivePayment(paymentId)
  const waiveLateMutation = useWaiveLateFee(paymentId)
  const [isRecordOpen, setIsRecordOpen] = useState(false)
  const [isWaiveOpen, setIsWaiveOpen] = useState(false)
  const [isWaiveLateOpen, setIsWaiveLateOpen] = useState(false)

  const canRecord =
    payment &&
    payment.status !== "paid" &&
    payment.status !== "waived" &&
    payment.status !== "overpaid"

  const canWaive = canRecord
  const canWaiveLate = payment && payment.lateFee > 0

  const handleWaive = useCallback(async () => {
    try {
      await waiveMutation.mutateAsync()
      toast.success("Payment waived successfully")
      setIsWaiveOpen(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to waive payment"
      )
    }
  }, [waiveMutation])

  const handleWaiveLateFee = useCallback(async () => {
    try {
      await waiveLateMutation.mutateAsync()
      toast.success("Late fee waived successfully")
      setIsWaiveLateOpen(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to waive late fee"
      )
    }
  }, [waiveLateMutation])

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded bg-muted" />
          <div className="h-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Payment not found.</p>
      </div>
    )
  }

  const remainingBalance =
    payment.amountDue + payment.lateFee - payment.amountPaid

  return (
    <div data-testid="payment-detail-page" className="space-y-6 p-6">
      <PageHeader
        title={`${payment.tenantName} — ${formatCurrency(payment.amountDue)}`}
        breadcrumbs={[
          { label: "Payments", href: PAYMENT_ROUTES.LIST },
          {
            label: `${payment.propertyName} — ${payment.unitLabel}`,
          },
        ]}
      >
        {canRecord && (
          <Button onClick={() => setIsRecordOpen(true)}>
            <Receipt className="h-4 w-4" />
            Record Payment
          </Button>
        )}
        {canWaive && (
          <Button variant="outline" onClick={() => setIsWaiveOpen(true)}>
            <Ban className="h-4 w-4" />
            Waive
          </Button>
        )}
        {canWaiveLate && (
          <Button variant="outline" onClick={() => setIsWaiveLateOpen(true)}>
            <ShieldOff className="h-4 w-4" />
            Waive Late Fee
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <PaymentDetailCard payment={payment} />
        <Card>
          <CardHeader>
            <CardTitle>Lease Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Property
                </dt>
                <dd className="text-sm">{payment.propertyName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Unit
                </dt>
                <dd className="text-sm">{payment.unitLabel}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Tenant
                </dt>
                <dd className="text-sm">{payment.tenantName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Monthly Rent
                </dt>
                <dd className="text-sm">
                  {formatCurrency(payment.monthlyRent)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <PaymentTimeline
        status={payment.status}
        dueDate={payment.dueDate}
        paidAt={payment.paidAt}
        createdAt={payment.createdAt}
      />

      {canRecord && (
        <RecordPaymentDialog
          open={isRecordOpen}
          onOpenChange={setIsRecordOpen}
          paymentId={paymentId}
          remainingBalance={remainingBalance}
        />
      )}

      <Dialog open={isWaiveOpen} onOpenChange={setIsWaiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Waive Payment</DialogTitle>
            <DialogDescription>
              Waive the remaining balance of {formatCurrency(remainingBalance)}{" "}
              for this payment?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWaiveOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              loading={waiveMutation.isPending}
              onClick={handleWaive}
            >
              Waive Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isWaiveLateOpen} onOpenChange={setIsWaiveLateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Waive Late Fee</DialogTitle>
            <DialogDescription>
              Waive the late fee of {formatCurrency(payment.lateFee)} for this
              payment?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWaiveLateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              loading={waiveLateMutation.isPending}
              onClick={handleWaiveLateFee}
            >
              Waive Late Fee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
