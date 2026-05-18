"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Bath, Bed, DollarSign, Maximize2, Pencil, Shield } from "lucide-react"

import { PageHeader } from "@/shared/components/page-header.component"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import type { Property, Unit } from "@/shared/types/property.types"

import { UnitStatusBadge } from "../components/unit-status-badge.component"
import { getProperty, getUnit } from "../services/properties.service"

type UnitDetailPageProps = {
  propertyId: string
  unitId: string
}

export default function UnitDetailPage({
  propertyId,
  unitId,
}: UnitDetailPageProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [unit, setUnit] = useState<Unit | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [propData, unitData] = await Promise.all([
        getProperty(propertyId),
        getUnit(unitId),
      ])
      setProperty(propData)
      setUnit(unitData)
      setIsLoading(false)
    }
    load()
  }, [propertyId, unitId])

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

  const details = [
    {
      label: "Bedrooms",
      value: unit.bedrooms ?? "—",
      icon: Bed,
    },
    {
      label: "Bathrooms",
      value: unit.bathrooms ?? "—",
      icon: Bath,
    },
    {
      label: "Sqft",
      value: unit.sqft ? unit.sqft.toLocaleString() : "—",
      icon: Maximize2,
    },
    {
      label: "Monthly Rent",
      value: `$${unit.monthlyRent.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      label: "Security Deposit",
      value: `$${unit.securityDeposit.toLocaleString()}`,
      icon: Shield,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Unit ${unit.label}`}
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          {
            label: property?.name ?? "Property",
            href: `/properties/${propertyId}`,
          },
          { label: unit.label },
        ]}
      >
        <UnitStatusBadge status={unit.status} />
        <Button variant="outline" asChild>
          <Link href={`/properties/${propertyId}/units/${unitId}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {details.map((detail) => (
          <Card key={detail.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <detail.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{detail.label}</p>
                <p className="text-lg leading-tight font-semibold">
                  {detail.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {unit.description && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium">Description</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {unit.description}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
          Lease information will be available in a future sprint.
        </div>
        <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
          Ticket history will be available in a future sprint.
        </div>
      </div>
    </div>
  )
}
