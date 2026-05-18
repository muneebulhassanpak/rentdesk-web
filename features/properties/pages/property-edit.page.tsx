"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { PageHeader } from "@/shared/components/page-header.component"
import { Card, CardContent } from "@/shared/components/ui/card"
import type { Property } from "@/shared/types/property.types"

import { PropertyForm } from "../components/property-form.component"
import type { PropertyFormValues } from "../schemas/property.schema"
import { getProperty, updateProperty } from "../services/properties.service"

type PropertyEditPageProps = {
  propertyId: string
}

export default function PropertyEditPage({
  propertyId,
}: PropertyEditPageProps) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const data = await getProperty(propertyId)
      setProperty(data)
      setIsLoading(false)
    }
    load()
  }, [propertyId])

  const handleSubmit = async (values: PropertyFormValues) => {
    setError(null)
    try {
      await updateProperty(propertyId, values)
      router.push(`/properties/${propertyId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update property")
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

  if (!property) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Property not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Edit ${property.name}`}
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          { label: property.name, href: `/properties/${propertyId}` },
          { label: "Edit" },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <PropertyForm
            defaultValues={{
              name: property.name,
              type: property.type,
              address: property.address,
              yearBuilt: property.yearBuilt,
              notes: property.notes,
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
