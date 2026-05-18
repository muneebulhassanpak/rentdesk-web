"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { PageHeader } from "@/shared/components/page-header.component"
import { Card, CardContent } from "@/shared/components/ui/card"
import { LEASE_ROUTES } from "@/shared/constants/routes.constants"

import { LeaseForm } from "../components/lease-form.component"
import type { CreateLeaseFormValues } from "../schemas/lease.schema"
import { createLease } from "../services/leases-mock.service"

export default function LeaseCreatePage() {
  const router = useRouter()

  const handleSubmit = async (values: CreateLeaseFormValues) => {
    try {
      const lease = await createLease(values)
      toast.success("Lease created successfully")
      router.push(LEASE_ROUTES.DETAIL(lease.id))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create lease")
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Create Lease"
        breadcrumbs={[
          { label: "Leases", href: LEASE_ROUTES.LIST },
          { label: "Create Lease" },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <LeaseForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
