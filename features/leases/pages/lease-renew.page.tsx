"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { PageHeader } from "@/shared/components/page-header.component"
import { Card, CardContent } from "@/shared/components/ui/card"
import { LEASE_ROUTES } from "@/shared/constants/routes.constants"

import { LeaseRenewalForm } from "../components/lease-renewal-form.component"
import { useLease, useRenewLease } from "../hooks/use-leases.hook"
import type { RenewLeaseFormValues } from "../schemas/lease.schema"

type LeaseRenewPageProps = {
  leaseId: string
}

export default function LeaseRenewPage({ leaseId }: LeaseRenewPageProps) {
  const router = useRouter()
  const { data: lease, isLoading } = useLease(leaseId)
  const renewMutation = useRenewLease(leaseId)

  const handleSubmit = async (values: RenewLeaseFormValues) => {
    try {
      const newLease = await renewMutation.mutateAsync(values)
      toast.success("Lease renewed successfully")
      router.push(LEASE_ROUTES.DETAIL(newLease.id))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to renew lease")
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

  if (!lease) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Lease not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Renew Lease"
        breadcrumbs={[
          { label: "Leases", href: LEASE_ROUTES.LIST },
          {
            label: `${lease.propertyName} — ${lease.unitLabel}`,
            href: LEASE_ROUTES.DETAIL(leaseId),
          },
          { label: "Renew" },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <LeaseRenewalForm currentLease={lease} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
