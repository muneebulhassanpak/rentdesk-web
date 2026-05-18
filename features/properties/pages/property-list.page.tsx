"use client"

import { useCallback, useState } from "react"
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
import type { PropertyType } from "@/shared/types/property.types"
import { PROPERTY_TYPE_LABELS } from "@/shared/types/property.types"

import { PropertyCard } from "../components/property-card.component"
import { propertyColumns } from "../components/property-columns"
import { useProperties } from "../hooks/use-properties.hook"

type ViewMode = "table" | "grid"

const ALL_TYPES = "all"

export default function PropertyListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>(ALL_TYPES)
  const [sorting, setSorting] = useState<SortingState>([])
  const [page, setPage] = useState(0)

  const { data: result, isLoading } = useProperties(user?.orgId ?? "", {
    role: user?.role,
    search: search || undefined,
    type: typeFilter !== ALL_TYPES ? (typeFilter as PropertyType) : undefined,
    page: page + 1,
  })

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(0)
  }, [])

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value)
    setPage(0)
  }, [])

  const handleAddProperty = useCallback(() => {
    router.push("/properties/new")
  }, [router])

  const isLandlord = user?.role === "landlord"
  const properties = result?.data ?? []
  const totalProperties = result?.total ?? 0

  if (isLoading && !result) {
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
        description={`${totalProperties} ${totalProperties === 1 ? "property" : "properties"} in your portfolio`}
      >
        {isLandlord && (
          <Button onClick={handleAddProperty}>
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        )}
      </PageHeader>

      {totalProperties === 0 && !search && typeFilter === ALL_TYPES ? (
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
                onChange={handleSearchChange}
                placeholder="Search properties..."
                className="w-full max-w-xs"
              />
              <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
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
              data={properties}
              sorting={sorting}
              onSortingChange={setSorting}
              pageCount={result?.pageCount ?? 1}
              page={page}
              onPageChange={setPage}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
