"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Archive, MapPin, Pencil, Plus } from "lucide-react"

import { ConfirmDialog } from "@/shared/components/confirm-dialog.component"
import { DataTable } from "@/shared/components/data-table.component"
import { EmptyState } from "@/shared/components/empty-state.component"
import { PageHeader } from "@/shared/components/page-header.component"
import { StatusBadge } from "@/shared/components/status-badge.component"
import { Button } from "@/shared/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs"
import { useAuth } from "@/shared/hooks/use-auth.hook"
import type { Property, Unit } from "@/shared/types/property.types"
import { PROPERTY_TYPE_LABELS } from "@/shared/types/property.types"

import { PropertyStats } from "../components/property-stats.component"
import { createUnitColumns } from "../components/unit-columns"
import {
  archiveProperty,
  getProperty,
  getUnits,
} from "../services/properties.service"

type PropertyDetailPageProps = {
  propertyId: string
}

export default function PropertyDetailPage({
  propertyId,
}: PropertyDetailPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [propData, unitData] = await Promise.all([
        getProperty(propertyId),
        getUnits(propertyId),
      ])
      setProperty(propData)
      setUnits(unitData)
      setIsLoading(false)
    }
    load()
  }, [propertyId])

  const handleArchive = useCallback(async () => {
    await archiveProperty(propertyId)
    router.push("/properties")
  }, [propertyId, router])

  const unitColumns = useMemo(() => createUnitColumns(propertyId), [propertyId])

  const isLandlord = user?.role === "landlord"

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-6 gap-4">
          {["s1", "s2", "s3", "s4", "s5", "s6"].map((id) => (
            <div key={id} className="h-20 animate-pulse rounded bg-muted" />
          ))}
        </div>
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

  const address = [
    property.address.line1,
    property.address.line2,
    property.address.city,
    property.address.state,
    property.address.postalCode,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={property.name}
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          { label: property.name },
        ]}
      >
        <Button variant="outline" asChild>
          <Link href={`/properties/${propertyId}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
        {isLandlord && (
          <ConfirmDialog
            trigger={
              <Button variant="outline">
                <Archive className="h-4 w-4" />
                Archive
              </Button>
            }
            title="Archive Property"
            description={`Are you sure you want to archive "${property.name}"? This property and its units will be hidden from your portfolio.`}
            confirmLabel="Archive"
            onConfirm={handleArchive}
            variant="destructive"
          />
        )}
      </PageHeader>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{address}</span>
        <StatusBadge label={PROPERTY_TYPE_LABELS[property.type]} />
        {property.yearBuilt && <span>Built {property.yearBuilt}</span>}
      </div>

      <PropertyStats property={property} />

      <Tabs defaultValue="units">
        <TabsList>
          <TabsTrigger value="units">Units ({units.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button asChild>
              <Link href={`/properties/${propertyId}/units/new`}>
                <Plus className="h-4 w-4" />
                Add Unit
              </Link>
            </Button>
          </div>

          {units.length === 0 ? (
            <EmptyState
              icon={Plus}
              title="No units yet"
              description="Add units to this property to start tracking occupancy and rent."
              actionLabel="Add Unit"
              onAction={() =>
                router.push(`/properties/${propertyId}/units/new`)
              }
            />
          ) : (
            <DataTable columns={unitColumns} data={units} />
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
            Documents will be available in a future sprint.
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
            Activity timeline will be available in a future sprint.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
