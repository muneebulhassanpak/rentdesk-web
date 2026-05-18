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
import { Textarea } from "@/shared/components/ui/textarea"

import { useTerminateLease } from "../hooks/use-leases.hook"
import {
  type TerminateLeaseFormValues,
  terminateLeaseSchema,
} from "../schemas/lease.schema"

type LeaseTerminationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaseId: string
}

export const LeaseTerminationDialog = ({
  open,
  onOpenChange,
  leaseId,
}: LeaseTerminationDialogProps) => {
  const terminateMutation = useTerminateLease(leaseId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TerminateLeaseFormValues>({
    resolver: zodResolver(terminateLeaseSchema),
    defaultValues: {
      terminationDate: "",
      reason: "",
      depositSettlementNotes: "",
    },
  })

  const onSubmit = async (values: TerminateLeaseFormValues) => {
    try {
      await terminateMutation.mutateAsync(values)
      toast.success("Lease terminated successfully")
      reset()
      onOpenChange(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to terminate lease"
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terminate Lease</DialogTitle>
          <DialogDescription>
            This action will terminate the lease. Please provide the termination
            details below.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="terminationDate">Termination Date</Label>
            <Input
              id="terminationDate"
              type="date"
              {...register("terminationDate")}
            />
            {errors.terminationDate && (
              <p className="text-sm text-destructive">
                {errors.terminationDate.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Reason for termination..."
              rows={3}
              {...register("reason")}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="depositSettlementNotes">
              Deposit Settlement Notes{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="depositSettlementNotes"
              placeholder="Notes about security deposit disposition..."
              rows={2}
              {...register("depositSettlementNotes")}
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
            <Button
              type="submit"
              variant="destructive"
              loading={terminateMutation.isPending}
            >
              Terminate Lease
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
