"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { Combobox } from "@/shared/components/combobox.component"
import { MultiCombobox } from "@/shared/components/multi-combobox.component"
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

import {
  usePropertyOptions,
  useTenantOptions,
  useUnitOptions,
} from "../hooks/use-leases.hook"
import {
  type CreateLeaseFormValues,
  createLeaseSchema,
} from "../schemas/lease.schema"

const MAX_DUE_DAY = 28

type LeaseFormProps = {
  onSubmit: (values: CreateLeaseFormValues) => Promise<void>
}

export const LeaseForm = ({ onSubmit }: LeaseFormProps) => {
  const { data: propertyOptions = [] } = usePropertyOptions()
  const { data: tenantOptions = [] } = useTenantOptions()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeaseFormValues>({
    resolver: zodResolver(createLeaseSchema),
    defaultValues: {
      propertyId: "",
      unitId: "",
      tenantIds: [],
      primaryTenantId: "",
      startDate: "",
      endDate: "",
      monthlyRent: 0,
      securityDeposit: 0,
      paymentDueDay: 1,
      notes: "",
    },
  })

  const selectedPropertyId = watch("propertyId")
  const selectedTenantIds = watch("tenantIds")
  const selectedPrimaryTenantId = watch("primaryTenantId")
  const selectedPaymentDueDay = watch("paymentDueDay")

  const { data: unitOptions = [] } = useUnitOptions(selectedPropertyId)

  useEffect(() => {
    setValue("unitId", "", { shouldValidate: false })
  }, [selectedPropertyId, setValue])

  const selectedTenantNames = tenantOptions.filter((t) =>
    selectedTenantIds.includes(t.value)
  )

  const dueDayOptions = Array.from({ length: MAX_DUE_DAY }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Property</Label>
          <Combobox
            options={propertyOptions}
            value={selectedPropertyId}
            onChange={(val) =>
              setValue("propertyId", val, { shouldValidate: true })
            }
            placeholder="Select property..."
            searchPlaceholder="Search properties..."
          />
          {errors.propertyId && (
            <p className="text-sm text-destructive">
              {errors.propertyId.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Unit</Label>
          <Combobox
            options={unitOptions}
            value={watch("unitId")}
            onChange={(val) =>
              setValue("unitId", val, { shouldValidate: true })
            }
            placeholder="Select unit..."
            searchPlaceholder="Search units..."
            disabled={!selectedPropertyId}
          />
          {errors.unitId && (
            <p className="text-sm text-destructive">{errors.unitId.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Tenants</Label>
        <MultiCombobox
          options={tenantOptions}
          values={selectedTenantIds}
          onChange={(vals) => {
            setValue("tenantIds", vals, { shouldValidate: true })
            if (
              selectedPrimaryTenantId &&
              !vals.includes(selectedPrimaryTenantId)
            ) {
              setValue("primaryTenantId", "", { shouldValidate: true })
            }
          }}
          placeholder="Select tenants..."
          searchPlaceholder="Search tenants..."
        />
        {errors.tenantIds && (
          <p className="text-sm text-destructive">{errors.tenantIds.message}</p>
        )}
      </div>

      {selectedTenantNames.length > 0 && (
        <fieldset className="grid gap-3">
          <legend className="text-sm font-medium">Primary Tenant</legend>
          <div className="grid gap-2">
            {selectedTenantNames.map((tenant) => (
              <label
                key={tenant.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="primaryTenantId"
                  value={tenant.value}
                  checked={selectedPrimaryTenantId === tenant.value}
                  onChange={() =>
                    setValue("primaryTenantId", tenant.value, {
                      shouldValidate: true,
                    })
                  }
                  className="accent-primary"
                />
                {tenant.label}
              </label>
            ))}
          </div>
          {errors.primaryTenantId && (
            <p className="text-sm text-destructive">
              {errors.primaryTenantId.message}
            </p>
          )}
        </fieldset>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-sm text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="endDate">End Date</Label>
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
            placeholder="0"
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
            placeholder="0"
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
              {dueDayOptions.map((option) => (
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
          placeholder="Any additional notes about this lease..."
          rows={3}
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          Create Lease
        </Button>
      </div>
    </form>
  )
}
