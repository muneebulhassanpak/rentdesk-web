"use client"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
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
import { UserAvatar } from "@/shared/components/user-avatar.component"
import type { LeaseDetail } from "@/shared/types/lease.types"

import {
  type RenewLeaseFormValues,
  renewLeaseSchema,
} from "../schemas/lease.schema"
import { addOneYear, DUE_DAY_OPTIONS, getNextDay } from "../utils/lease.utils"

type LeaseRenewalFormProps = {
  currentLease: LeaseDetail
  onSubmit: (values: RenewLeaseFormValues) => Promise<void>
}

export const LeaseRenewalForm = ({
  currentLease,
  onSubmit,
}: LeaseRenewalFormProps) => {
  const defaultStartDate = getNextDay(currentLease.endDate)
  const defaultEndDate = addOneYear(defaultStartDate)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RenewLeaseFormValues>({
    resolver: zodResolver(renewLeaseSchema),
    defaultValues: {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      monthlyRent: currentLease.monthlyRent,
      securityDeposit: currentLease.securityDeposit,
      paymentDueDay: currentLease.paymentDueDay,
      notes: "",
    },
  })

  const selectedPaymentDueDay = watch("paymentDueDay")

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            Property
          </span>
          <span className="text-sm">{currentLease.propertyName}</span>
        </div>
        <div className="grid gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            Unit
          </span>
          <span className="text-sm">{currentLease.unitLabel}</span>
        </div>
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Tenants (carried over from current lease)
        </span>
        <div className="grid gap-2">
          {currentLease.tenants.map((tenant) => {
            const name = tenant.fullName ?? "Tenant"
            return (
              <div key={tenant.tenantId} className="flex items-center gap-2">
                <UserAvatar
                  fullName={name}
                  avatarUrl={tenant.avatarUrl}
                  size="sm"
                />
                <span className="text-sm">{name}</span>
                {tenant.isPrimary && <Badge variant="secondary">Primary</Badge>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="startDate">New Start Date</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-sm text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="endDate">New End Date</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
          <Input
            id="monthlyRent"
            type="number"
            {...register("monthlyRent", { valueAsNumber: true })}
          />
          {errors.monthlyRent && (
            <p className="text-sm text-destructive">
              {errors.monthlyRent.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
          <Input
            id="securityDeposit"
            type="number"
            {...register("securityDeposit", { valueAsNumber: true })}
          />
          {errors.securityDeposit && (
            <p className="text-sm text-destructive">
              {errors.securityDeposit.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Payment Due Day</Label>
          <Select
            value={String(selectedPaymentDueDay)}
            onValueChange={(val) =>
              setValue("paymentDueDay", Number(val), { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DUE_DAY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.paymentDueDay && (
            <p className="text-sm text-destructive">
              {errors.paymentDueDay.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">
          Notes <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Any notes for the renewed lease..."
          rows={3}
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          Renew Lease
        </Button>
      </div>
    </form>
  )
}
