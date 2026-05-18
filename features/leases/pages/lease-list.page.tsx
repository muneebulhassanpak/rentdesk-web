"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { FileText, Plus } from "lucide-react"

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
import { LEASE_ROUTES } from "@/shared/constants/routes.constants"
import { useAuth } from "@/shared/hooks/use-auth.hook"
import type { Lease, LeaseStatus } from "@/shared/types/lease.types"
import { LEASE_STATUS_LABELS } from "@/shared/types/lease.types"
import type { PaginatedResponse } from "@/shared/types/property.types"

import { leaseColumns } from "../components/lease-columns"
import { getLeases, getPropertyOptions } from "../services/leases.service"

const ALL_STATUSES = "all"
const ALL_PROPERTIES = "all"

export default function LeaseListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [result, setResult] = useState<PaginatedResponse<Lease> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES)
  const [propertyFilter, setPropertyFilter] = useState<string>(ALL_PROPERTIES)
  const [page, setPage] = useState(0)
  const [propertyOptions, setPropertyOptions] = useState<
    { value: string; label: string }[]
  >([])

  useEffect(() => {
    getPropertyOptions().then(setPropertyOptions)
  }, [])

  useEffect(() => {
    if (!user) return
    let cancelled = false

    getLeases(user.orgId, {
      search: search || undefined,
      status:
        statusFilter !== ALL_STATUSES
          ? (statusFilter as LeaseStatus)
          : undefined,
      propertyId:
        propertyFilter !== ALL_PROPERTIES ? propertyFilter : undefined,
      page: page + 1,
    }).then((data) => {
      if (!cancelled) {
        setResult(data)
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [user, search, statusFilter, propertyFilter, page])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(0)
  }, [])

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value)
    setPage(0)
  }, [])

  const handlePropertyFilterChange = useCallback((value: string) => {
    setPropertyFilter(value)
    setPage(0)
  }, [])

  const handleCreateLease = useCallback(() => {
    router.push(LEASE_ROUTES.NEW)
  }, [router])

  const leases = result?.data ?? []
  const totalLeases = result?.total ?? 0

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
        title="Leases"
        description={`${totalLeases} ${totalLeases === 1 ? "lease" : "leases"} total`}
      >
        <Button onClick={handleCreateLease}>
          <Plus className="h-4 w-4" />
          Create Lease
        </Button>
      </PageHeader>

      {totalLeases === 0 &&
      !search &&
      statusFilter === ALL_STATUSES &&
      propertyFilter === ALL_PROPERTIES ? (
        <EmptyState
          icon={FileText}
          title="No leases yet"
          description="Create your first lease to start tracking agreements."
          actionLabel="Create Lease"
          onAction={handleCreateLease}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search leases..."
              className="w-full max-w-xs"
            />
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
                {(
                  Object.entries(LEASE_STATUS_LABELS) as [LeaseStatus, string][]
                ).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={propertyFilter}
              onValueChange={handlePropertyFilterChange}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_PROPERTIES}>All properties</SelectItem>
                {propertyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DataTable
            columns={leaseColumns}
            data={leases}
            pageCount={result?.pageCount ?? 1}
            page={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
