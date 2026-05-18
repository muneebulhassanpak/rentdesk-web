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

import {
  type TerminateLeaseFormValues,
  terminateLeaseSchema,
} from "../schemas/lease.schema"
import { terminateLease } from "../services/leases-mock.service"

type LeaseTerminationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaseId: string
  onTerminated: () => void
}

export const LeaseTerminationDialog = ({
  open,
  onOpenChange,
  leaseId,
  onTerminated,
}: LeaseTerminationDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TerminateLeaseFormValues>({
    resolver: zodResolver(terminateLeaseSchema),
    defaultValues: {
      terminationDate: "",
      reason: "",
      depositNotes: "",
    },
  })

  const onSubmit = async (values: TerminateLeaseFormValues) => {
    try {
      await terminateLease(leaseId, values)
      toast.success("Lease terminated successfully")
      reset()
      onOpenChange(false)
      onTerminated()
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
            <Label htmlFor="depositNotes">
              Deposit Notes{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="depositNotes"
              placeholder="Notes about security deposit disposition..."
              rows={2}
              {...register("depositNotes")}
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
            <Button type="submit" variant="destructive" loading={isSubmitting}>
              Terminate Lease
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
