"use client"

import { useCallback, useState } from "react"
import Link from "next/link"

import { CheckCircle, Pencil, RefreshCw, XCircle } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/shared/components/page-header.component"
import { Button } from "@/shared/components/ui/button"
import { LEASE_ROUTES } from "@/shared/constants/routes.constants"

import { LeaseDetailCard } from "../components/lease-detail-card.component"
import { LeaseTenantsList } from "../components/lease-tenants-list.component"
import { LeaseTerminationDialog } from "../components/lease-termination-dialog.component"
import { LeaseTimeline } from "../components/lease-timeline.component"
import { useActivateLease, useLease } from "../hooks/use-leases.hook"

type LeaseDetailPageProps = {
  leaseId: string
}

export default function LeaseDetailPage({ leaseId }: LeaseDetailPageProps) {
  const { data: lease, isLoading } = useLease(leaseId)
  const activateMutation = useActivateLease(leaseId)
  const [isTerminateOpen, setIsTerminateOpen] = useState(false)

  const handleActivate = useCallback(async () => {
    try {
      await activateMutation.mutateAsync()
      toast.success("Lease activated successfully")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to activate lease"
      )
    }
  }, [activateMutation])

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded bg-muted" />
          <div className="h-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-32 animate-pulse rounded bg-muted" />
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

  const isDraft = lease.status === "draft"
  const isRenewable =
    lease.status === "active" || lease.status === "expiring_soon"

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`${lease.propertyName} — ${lease.unitLabel}`}
        breadcrumbs={[
          { label: "Leases", href: LEASE_ROUTES.LIST },
          { label: `${lease.propertyName} — ${lease.unitLabel}` },
        ]}
      >
        {isDraft && (
          <>
            <Button variant="outline" asChild>
              <Link href={LEASE_ROUTES.EDIT(leaseId)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              onClick={handleActivate}
              loading={activateMutation.isPending}
            >
              <CheckCircle className="h-4 w-4" />
              Activate
            </Button>
          </>
        )}
        {isRenewable && (
          <>
            <Button variant="outline" asChild>
              <Link href={LEASE_ROUTES.RENEW(leaseId)}>
                <RefreshCw className="h-4 w-4" />
                Renew
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setIsTerminateOpen(true)}>
              <XCircle className="h-4 w-4" />
              Terminate
            </Button>
          </>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <LeaseDetailCard lease={lease} />
        <LeaseTenantsList tenants={lease.tenants} />
      </div>

      <LeaseTimeline startDate={lease.startDate} endDate={lease.endDate} />

      <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        Payment history will be available in a future sprint.
      </div>

      <LeaseTerminationDialog
        open={isTerminateOpen}
        onOpenChange={setIsTerminateOpen}
        leaseId={leaseId}
      />
    </div>
  )
}
