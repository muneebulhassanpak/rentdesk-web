"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { PageHeader } from "@/shared/components/page-header.component"
import { Card, CardContent } from "@/shared/components/ui/card"
import { TENANT_ROUTES } from "@/shared/constants/routes.constants"
import type { TenantDetail } from "@/shared/types/tenant.types"

import { TenantForm } from "../components/tenant-form.component"
import type { EditTenantFormValues } from "../schemas/tenant.schema"
import { getTenant, updateTenant } from "../services/tenants.service"

type TenantEditPageProps = {
  tenantId: string
}

export default function TenantEditPage({ tenantId }: TenantEditPageProps) {
  const router = useRouter()
  const [tenant, setTenant] = useState<TenantDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await getTenant(tenantId)
      setTenant(data)
      setIsLoading(false)
    }
    load()
  }, [tenantId])

  const handleSubmit = async (values: EditTenantFormValues) => {
    setIsSubmitting(true)
    try {
      await updateTenant(tenantId, values)
      toast.success("Tenant updated successfully")
      router.push(TENANT_ROUTES.DETAIL(tenantId))
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update tenant"
      )
    } finally {
      setIsSubmitting(false)
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
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}
