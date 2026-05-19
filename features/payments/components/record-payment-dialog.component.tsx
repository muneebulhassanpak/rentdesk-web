"use client"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import type { PaymentMethod } from "@/shared/types/payment.types"
import { PAYMENT_METHOD_LABELS } from "@/shared/types/payment.types"

import { useRecordPayment } from "../hooks/use-payments.hook"
import {
  type RecordPaymentFormValues,
  recordPaymentSchema,
} from "../schemas/payment.schema"
import { formatCurrency } from "../utils/payment.utils"

type RecordPaymentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentId: string
  remainingBalance: number
}

export const RecordPaymentDialog = ({
  open,
  onOpenChange,
  paymentId,
  remainingBalance,
}: RecordPaymentDialogProps) => {
  const recordMutation = useRecordPayment(paymentId)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecordPaymentFormValues>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: {
      amount: remainingBalance,
      method: undefined,
      date: new Date().toISOString().split("T")[0],
      reference: "",
      notes: "",
    },
  })

  const selectedMethod = watch("method")

  const onSubmit = async (values: RecordPaymentFormValues) => {
    try {
      await recordMutation.mutateAsync(values)
      toast.success("Payment recorded successfully")
      reset()
      onOpenChange(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to record payment"
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="record-payment-dialog">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Remaining balance: {formatCurrency(remainingBalance)}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Payment Date</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Payment Method</Label>
            <Select
              value={selectedMethod}
              onValueChange={(val) =>
                setValue("method", val as PaymentMethod, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(PAYMENT_METHOD_LABELS) as [
                    PaymentMethod,
                    string,
                  ][]
                ).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.method && (
              <p className="text-sm text-destructive">
                {errors.method.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reference">
              Reference Number{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="reference"
              placeholder="Check #, transaction ID..."
              {...register("reference")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              rows={2}
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={recordMutation.isPending}>
              Record Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
