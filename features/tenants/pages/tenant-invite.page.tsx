"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { PageHeader } from "@/shared/components/page-header.component"
import { Card, CardContent } from "@/shared/components/ui/card"
import { TENANT_ROUTES } from "@/shared/constants/routes.constants"

import { TenantForm } from "../components/tenant-form.component"
import type { InviteTenantFormValues } from "../schemas/tenant.schema"
import { createTenant } from "../services/tenants.service"

export default function TenantInvitePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: InviteTenantFormValues) => {
    setIsSubmitting(true)
    try {
      await createTenant(values)
      toast.success(`Invitation sent to ${values.email}`)
      router.push(TENANT_ROUTES.LIST)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send invitation"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Invite Tenant"
        breadcrumbs={[
          { label: "Tenants", href: TENANT_ROUTES.LIST },
          { label: "Invite Tenant" },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <TenantForm
            mode="invite"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}
