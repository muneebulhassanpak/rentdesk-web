"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { PageHeader } from "@/shared/components/page-header.component"
import { Card, CardContent } from "@/shared/components/ui/card"

import { UnitForm } from "../components/unit-form.component"
import {
  useProperty,
  useUnit,
  useUpdateUnit,
} from "../hooks/use-properties.hook"
import type { UnitFormValues } from "../schemas/unit.schema"

type UnitEditPageProps = {
  propertyId: string
  unitId: string
}

export default function UnitEditPage({
  propertyId,
  unitId,
}: UnitEditPageProps) {
  const router = useRouter()
  const { data: property } = useProperty(propertyId)
  const { data: unit, isLoading } = useUnit(unitId)
  const updateMutation = useUpdateUnit(propertyId, unitId)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: UnitFormValues) => {
    setError(null)
    try {
      await updateMutation.mutateAsync(values)
      router.push(`/properties/${propertyId}/units/${unitId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update unit")
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

  if (!unit) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Unit not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Edit Unit ${unit.label}`}
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          {
            label: property?.name ?? "Property",
            href: `/properties/${propertyId}`,
          },
          {
            label: unit.label,
            href: `/properties/${propertyId}/units/${unitId}`,
          },
          { label: "Edit" },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <UnitForm
            defaultValues={{
              label: unit.label,
              bedrooms: unit.bedrooms,
              bathrooms: unit.bathrooms,
              sqft: unit.sqft,
              monthlyRent: unit.monthlyRent,
              securityDeposit: unit.securityDeposit,
              status: unit.status,
              description: unit.description,
            }}
            onSubmit={handleSubmit}
            error={error}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
