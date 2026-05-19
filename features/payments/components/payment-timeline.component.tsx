import { CheckCircle, Circle, Clock } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { cn } from "@/shared/lib/utils"
import type { PaymentStatus } from "@/shared/types/payment.types"

type PaymentTimelineProps = {
  status: PaymentStatus
  dueDate: string
  paidAt?: string
  createdAt: string
}

type TimelineStep = {
  label: string
  date: string | null
  completed: boolean
  current: boolean
}

const getSteps = (
  status: PaymentStatus,
  createdAt: string,
  dueDate: string,
  paidAt?: string
): TimelineStep[] => {
  const scheduled = {
    label: "Scheduled",
    date: createdAt,
    completed: true,
    current: status === "scheduled",
  }

  const due = {
    label: "Due",
    date: dueDate,
    completed: status !== "scheduled",
    current: status === "due" || status === "late",
  }

  const paid = {
    label: status === "waived" ? "Waived" : "Paid",
    date: paidAt ?? null,
    completed:
      status === "paid" ||
      status === "overpaid" ||
      status === "partial" ||
      status === "waived",
    current:
      status === "paid" ||
      status === "overpaid" ||
      status === "partial" ||
      status === "waived",
  }

  return [scheduled, due, paid]
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

export const PaymentTimeline = ({
  status,
  dueDate,
  paidAt,
  createdAt,
}: PaymentTimelineProps) => {
  const steps = getSteps(status, createdAt, dueDate, paidAt)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                {step.completed ? (
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                ) : step.current ? (
                  <Clock className="h-6 w-6 text-orange-500" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground/40" />
                )}
                <span className="text-xs font-medium">{step.label}</span>
                {step.date && (
                  <span className="text-[10px] text-muted-foreground">
                    {formatDate(step.date)}
                  </span>
                )}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-px flex-1",
                    steps[idx + 1].completed
                      ? "bg-emerald-600"
                      : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
