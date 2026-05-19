import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import type { PaymentDetail } from "@/shared/types/payment.types"
import { PAYMENT_METHOD_LABELS } from "@/shared/types/payment.types"

import { formatCurrency } from "../utils/payment.utils"
import { PaymentStatusBadge } from "./payment-status-badge.component"

type PaymentDetailCardProps = {
  payment: PaymentDetail
}

export const PaymentDetailCard = ({ payment }: PaymentDetailCardProps) => {
  return (
    <Card data-testid="payment-detail-card">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Status
            </dt>
            <dd className="mt-1">
              <PaymentStatusBadge status={payment.status} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Due Date
            </dt>
            <dd className="text-sm">
              {new Date(payment.dueDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Amount Due
            </dt>
            <dd className="text-sm font-medium">
              {formatCurrency(payment.amountDue)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Amount Paid
            </dt>
            <dd className="text-sm font-medium text-emerald-600">
              {payment.amountPaid > 0
                ? formatCurrency(payment.amountPaid)
                : "\u2014"}
            </dd>
          </div>
          {payment.lateFee > 0 && (
            <>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Late Fee
                </dt>
                <dd className="text-sm font-medium text-red-600">
                  {formatCurrency(payment.lateFee)}
                </dd>
              </div>
              {payment.lateFeeAppliedAt && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    Late Fee Applied
                  </dt>
                  <dd className="text-sm">
                    {new Date(payment.lateFeeAppliedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </dd>
                </div>
              )}
            </>
          )}
          {payment.method && (
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Payment Method
              </dt>
              <dd className="text-sm">
                {PAYMENT_METHOD_LABELS[payment.method]}
              </dd>
            </div>
          )}
          {payment.reference && (
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Reference
              </dt>
              <dd className="font-mono text-sm">{payment.reference}</dd>
            </div>
          )}
          {payment.paidAt && (
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Paid On
              </dt>
              <dd className="text-sm">
                {new Date(payment.paidAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </dd>
            </div>
          )}
        </dl>
        {payment.notes && (
          <div className="mt-4 border-t pt-4">
            <dt className="text-xs font-medium text-muted-foreground">Notes</dt>
            <dd className="mt-1 text-sm">{payment.notes}</dd>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
