"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { PageHeader } from "@/shared/components/page-header.component"
import { Card, CardContent } from "@/shared/components/ui/card"

import { PropertyForm } from "../components/property-form.component"
import type { PropertyFormValues } from "../schemas/property.schema"
import { createProperty } from "../services/properties.service"

export default function PropertyCreatePage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: PropertyFormValues) => {
    setError(null)
    try {
      const property = await createProperty(values)
      router.push(`/properties/${property.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create property")
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Add Property"
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          { label: "Add Property" },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <PropertyForm
            onSubmit={handleSubmit}
            error={error}
            submitLabel="Create Property"
          />
        </CardContent>
      </Card>
    </div>
  )
}
