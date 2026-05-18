"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { PageHeader } from "@/shared/components/page-header.component"
import { Card, CardContent } from "@/shared/components/ui/card"
import { TENANT_ROUTES } from "@/shared/constants/routes.constants"

import { TenantForm } from "../components/tenant-form.component"
import { useTenant, useUpdateTenant } from "../hooks/use-tenants.hook"
import type { EditTenantFormValues } from "../schemas/tenant.schema"

type TenantEditPageProps = {
  tenantId: string
}

export default function TenantEditPage({ tenantId }: TenantEditPageProps) {
  const router = useRouter()
  const { data: tenant, isLoading } = useTenant(tenantId)
  const updateMutation = useUpdateTenant(tenantId)

  const handleSubmit = async (values: EditTenantFormValues) => {
    try {
      await updateMutation.mutateAsync(values)
      toast.success("Tenant updated successfully")
      router.push(TENANT_ROUTES.DETAIL(tenantId))
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update tenant"
      )
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Tenant not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Edit ${tenant.fullName}`}
        breadcrumbs={[
          { label: "Tenants", href: TENANT_ROUTES.LIST },
          {
            label: tenant.fullName,
            href: TENANT_ROUTES.DETAIL(tenantId),
          },
          { label: "Edit" },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <TenantForm
            mode="edit"
            defaultValues={{
              fullName: tenant.fullName,
              phone: tenant.phone ?? "",
              emergencyContactName: tenant.emergencyContactName ?? "",
              emergencyContactPhone: tenant.emergencyContactPhone ?? "",
            }}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}
