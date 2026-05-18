"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { type SortingState } from "@tanstack/react-table"
import { Building2, LayoutGrid, List, Plus } from "lucide-react"

import { DataTable } from "@/shared/components/data-table.component"
import { EmptyState } from "@/shared/components/empty-state.component"
import { PageHeader } from "@/shared/components/page-header.component"
import { SearchInput } from "@/shared/components/search-input.component"
import { Button } from "@/shared/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { useAuth } from "@/shared/hooks/use-auth.hook"
import type { Property, PropertyType } from "@/shared/types/property.types"
import { PROPERTY_TYPE_LABELS } from "@/shared/types/property.types"

import { PropertyCard } from "../components/property-card.component"
import { propertyColumns } from "../components/property-columns"
import { getProperties } from "../services/properties-mock.service"

type ViewMode = "table" | "grid"

const ALL_TYPES = "all"

export default function PropertyListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>(ALL_TYPES)
  const [sorting, setSorting] = useState<SortingState>([])

  useEffect(() => {
    const load = async () => {
      if (!user) return
      const data = await getProperties(user.orgId, user.role)
      setProperties(data)
      setIsLoading(false)
    }
    load()
  }, [user])

  const filtered = useMemo(() => {
    let result = properties

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.line1.toLowerCase().includes(q) ||
          p.address.city.toLowerCase().includes(q)
      )
    }

    if (typeFilter !== ALL_TYPES) {
      result = result.filter((p) => p.type === typeFilter)
    }

    return result
  }, [properties, search, typeFilter])

  const handleAddProperty = useCallback(() => {
    router.push("/properties/new")
  }, [router])

  const isLandlord = user?.role === "landlord"

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Properties"
        description={`${properties.length} ${properties.length === 1 ? "property" : "properties"} in your portfolio`}
      >
        {isLandlord && (
          <Button onClick={handleAddProperty}>
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        )}
      </PageHeader>

      {properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties yet"
          description="Add your first property to start managing your portfolio."
          actionLabel={isLandlord ? "Add Property" : undefined}
          onAction={isLandlord ? handleAddProperty : undefined}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search properties..."
                className="w-full max-w-xs"
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_TYPES}>All types</SelectItem>
                  {(
                    Object.entries(PROPERTY_TYPE_LABELS) as [
                      PropertyType,
                      string,
                    ][]
                  ).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1 rounded-lg border p-0.5">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setViewMode("table")}
                aria-label="Table view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === "table" ? (
            <DataTable
              columns={propertyColumns}
              data={filtered}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
