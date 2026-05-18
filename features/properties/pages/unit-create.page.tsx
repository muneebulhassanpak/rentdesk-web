"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { PageHeader } from "@/shared/components/page-header.component"
import { Card, CardContent } from "@/shared/components/ui/card"

import { UnitForm } from "../components/unit-form.component"
import { useCreateUnit, useProperty } from "../hooks/use-properties.hook"
import type { UnitFormValues } from "../schemas/unit.schema"

type UnitCreatePageProps = {
  propertyId: string
}

export default function UnitCreatePage({ propertyId }: UnitCreatePageProps) {
  const router = useRouter()
  const { data: property } = useProperty(propertyId)
  const createMutation = useCreateUnit(propertyId)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: UnitFormValues) => {
    setError(null)
    try {
      await createMutation.mutateAsync({ ...values, propertyId })
      router.push(`/properties/${propertyId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create unit")
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Add Unit"
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          {
            label: property?.name ?? "Property",
            href: `/properties/${propertyId}`,
          },
          { label: "Add Unit" },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <UnitForm
            onSubmit={handleSubmit}
            error={error}
            submitLabel="Create Unit"
          />
        </CardContent>
      </Card>
    </div>
  )
}
