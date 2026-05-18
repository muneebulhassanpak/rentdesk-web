"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { MultiCombobox } from "@/shared/components/multi-combobox.component"
import { PageHeader } from "@/shared/components/page-header.component"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
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
import { LEASE_ROUTES } from "@/shared/constants/routes.constants"
import type { LeaseDetail } from "@/shared/types/lease.types"

import {
  useLease,
  useTenantOptions,
  useUpdateLease,
} from "../hooks/use-leases.hook"
import {
  type EditLeaseFormValues,
  editLeaseSchema,
} from "../schemas/lease.schema"
import { DUE_DAY_OPTIONS } from "../utils/lease.utils"

type LeaseEditPageProps = {
  leaseId: string
}

export default function LeaseEditPage({ leaseId }: LeaseEditPageProps) {
  const { data: lease, isLoading } = useLease(leaseId)

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!lease) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Lease not found.</p>
      </div>
    )
  }

  if (lease.status !== "draft") {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          Only draft leases can be edited.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit Lease"
        breadcrumbs={[
          { label: "Leases", href: LEASE_ROUTES.LIST },
          {
            label: `${lease.propertyName} — ${lease.unitLabel}`,
            href: LEASE_ROUTES.DETAIL(leaseId),
          },
          { label: "Edit" },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <LeaseEditForm lease={lease} leaseId={leaseId} />
        </CardContent>
      </Card>
    </div>
  )
}

type LeaseEditFormProps = {
  lease: LeaseDetail
  leaseId: string
}

function LeaseEditForm({ lease, leaseId }: LeaseEditFormProps) {
  const router = useRouter()
  const { data: tenantOptions = [] } = useTenantOptions()
  const updateMutation = useUpdateLease(leaseId)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditLeaseFormValues>({
    resolver: zodResolver(editLeaseSchema),
    defaultValues: {
      tenantIds: lease.tenants.map((t) => t.tenantId),
      primaryTenantId: lease.primaryTenant.tenantId,
      startDate: lease.startDate,
      endDate: lease.endDate,
      monthlyRent: lease.monthlyRent,
      securityDeposit: lease.securityDeposit,
      paymentDueDay: lease.paymentDueDay,
      notes: lease.notes ?? "",
    },
  })

  const selectedTenantIds = watch("tenantIds")
  const selectedPrimaryTenantId = watch("primaryTenantId")
  const selectedPaymentDueDay = watch("paymentDueDay")

  const selectedTenantNames = tenantOptions.filter((t) =>
    selectedTenantIds.includes(t.value)
  )

  const onSubmit = async (values: EditLeaseFormValues) => {
    try {
      await updateMutation.mutateAsync(values)
      toast.success("Lease updated successfully")
      router.push(LEASE_ROUTES.DETAIL(leaseId))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update lease")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6">
      <div className="grid gap-2">
        <Label>
          Property / Unit{" "}
          <span className="text-muted-foreground">(read-only)</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          {lease.propertyName} — {lease.unitLabel}
        </p>
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
          placeholder="Any additional notes..."
          rows={3}
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={updateMutation.isPending}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
