"use client"

import { CreditCard } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import type { Payment } from "@/shared/types/payment.types"

import { useCreateStripeCheckout } from "../hooks/use-payments.hook"
import { formatCurrency } from "../utils/payment.utils"

type PayNowCardProps = {
  payment: Payment
}

export const PayNowCard = ({ payment }: PayNowCardProps) => {
  const checkoutMutation = useCreateStripeCheckout(payment.id)

  const remainingBalance =
    payment.amountDue + payment.lateFee - payment.amountPaid

  const handlePayNow = async () => {
    try {
      const { checkoutUrl } = await checkoutMutation.mutateAsync()
      window.location.href = checkoutUrl
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start checkout"
      )
    }
  }

  const isPaid =
    payment.status === "paid" ||
    payment.status === "waived" ||
    payment.status === "overpaid"

  return (
    <Card data-testid="pay-now-card">
      <CardHeader>
        <CardTitle>{isPaid ? "Payment Complete" : "Payment Due"}</CardTitle>
        <CardDescription>
          {isPaid
            ? "Your payment has been received."
            : `Due ${new Date(payment.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-4xl font-bold tracking-tight">
            {formatCurrency(isPaid ? payment.amountPaid : remainingBalance)}
          </p>
          {payment.lateFee > 0 && !isPaid && (
            <p className="mt-1 text-sm text-red-600">
              Includes {formatCurrency(payment.lateFee)} late fee
            </p>
          )}
        </div>
        {!isPaid && (
          <Button
            className="w-full"
            size="lg"
            loading={checkoutMutation.isPending}
            onClick={handlePayNow}
          >
            <CreditCard className="h-4 w-4" />
            Pay Now
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
