"use client"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

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
import type { UnitStatus } from "@/shared/types/property.types"
import { UNIT_STATUS_LABELS } from "@/shared/types/property.types"

import { type UnitFormValues, unitSchema } from "../schemas/unit.schema"

type UnitFormProps = {
  defaultValues?: Partial<UnitFormValues>
  onSubmit: (values: UnitFormValues) => Promise<void>
  error?: string | null
  submitLabel?: string
}

export const UnitForm = ({
  defaultValues,
  onSubmit,
  error,
  submitLabel = "Save Unit",
}: UnitFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      label: "",
      monthlyRent: 0,
      securityDeposit: 0,
      status: "vacant",
      description: "",
      ...defaultValues,
    },
  })

  const selectedStatus = watch("status")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="label">Unit Label</Label>
          <Input
            id="label"
            placeholder="e.g. 1A, Suite B, Main"
            {...register("label")}
          />
          {errors.label && (
            <p className="text-sm text-destructive">{errors.label.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={selectedStatus}
            onValueChange={(val) =>
              setValue("status", val as UnitStatus, { shouldValidate: true })
            }
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(UNIT_STATUS_LABELS) as [UnitStatus, string][]
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="bedrooms">
            Bedrooms <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="bedrooms"
            type="number"
            step="0.5"
            placeholder="2"
            {...register("bedrooms", { valueAsNumber: true })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bathrooms">
            Bathrooms <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="bathrooms"
            type="number"
            step="0.5"
            placeholder="1"
            {...register("bathrooms", { valueAsNumber: true })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="sqft">
            Sqft <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="sqft"
            type="number"
            placeholder="850"
            {...register("sqft", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
          <Input
            id="monthlyRent"
            type="number"
            step="0.01"
            placeholder="1500"
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
            step="0.01"
            placeholder="1500"
            {...register("securityDeposit", { valueAsNumber: true })}
          />
          {errors.securityDeposit && (
            <p className="text-sm text-destructive">
              {errors.securityDeposit.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">
          Description <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Any details about this unit..."
          rows={3}
          {...register("description")}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
