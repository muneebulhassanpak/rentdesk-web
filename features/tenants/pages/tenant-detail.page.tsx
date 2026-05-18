"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import { UserX } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/shared/components/confirm-dialog.component"
import { PageHeader } from "@/shared/components/page-header.component"
import { Button } from "@/shared/components/ui/button"
import { TENANT_ROUTES } from "@/shared/constants/routes.constants"

import { TenantLeaseHistory } from "../components/tenant-lease-history.component"
import { TenantProfileCard } from "../components/tenant-profile-card.component"
import { useDeactivateTenant, useTenant } from "../hooks/use-tenants.hook"

type TenantDetailPageProps = {
  tenantId: string
}

export default function TenantDetailPage({ tenantId }: TenantDetailPageProps) {
  const router = useRouter()
  const { data: tenant, isLoading } = useTenant(tenantId)
  const deactivateMutation = useDeactivateTenant(tenantId)

  const handleDeactivate = useCallback(async () => {
    const result = await deactivateMutation.mutateAsync()
    if (result) {
      toast.success(`${result.fullName} has been deactivated`)
      router.push(TENANT_ROUTES.LIST)
    }
  }, [deactivateMutation, router])

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded bg-muted" />
          <div className="h-48 animate-pulse rounded bg-muted" />
        </div>
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
        title={tenant.fullName}
        breadcrumbs={[
          { label: "Tenants", href: TENANT_ROUTES.LIST },
          { label: tenant.fullName },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <TenantProfileCard
          tenant={tenant}
          deactivateButton={
            <ConfirmDialog
              trigger={
                <Button variant="outline" size="sm">
                  <UserX className="h-4 w-4" />
                  Deactivate
                </Button>
              }
              title="Deactivate Tenant"
              description={`Are you sure you want to deactivate ${tenant.fullName}? They will no longer be able to access the tenant portal.`}
              confirmLabel="Deactivate"
              onConfirm={handleDeactivate}
              variant="destructive"
            />
          }
        />
        <TenantLeaseHistory entries={tenant.leaseHistory} />
      </div>
    </div>
  )
}
