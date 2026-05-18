"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { PageHeader } from "@/shared/components/page-header.component"
import { Card, CardContent } from "@/shared/components/ui/card"
import type { Property } from "@/shared/types/property.types"

import { UnitForm } from "../components/unit-form.component"
import type { UnitFormValues } from "../schemas/unit.schema"
import { createUnit, getProperty } from "../services/properties-mock.service"

type UnitCreatePageProps = {
  propertyId: string
}

export default function UnitCreatePage({ propertyId }: UnitCreatePageProps) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const data = await getProperty(propertyId)
      setProperty(data)
    }
    load()
  }, [propertyId])

  const handleSubmit = async (values: UnitFormValues) => {
    setError(null)
    try {
      await createUnit({ ...values, propertyId })
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
