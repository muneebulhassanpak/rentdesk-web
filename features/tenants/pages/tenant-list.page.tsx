"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import { Plus, Users } from "lucide-react"

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
import { TENANT_ROUTES } from "@/shared/constants/routes.constants"
import { useAuth } from "@/shared/hooks/use-auth.hook"
import type { TenantStatus } from "@/shared/types/tenant.types"
import { TENANT_STATUS_LABELS } from "@/shared/types/tenant.types"

import { tenantColumns } from "../components/tenant-columns"
import { useTenants } from "../hooks/use-tenants.hook"
import { ALL_STATUSES } from "../utils/tenant.utils"

export default function TenantListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES)
  const [page, setPage] = useState(0)

  const { data: result, isLoading } = useTenants(user?.orgId ?? "", {
    search: search || undefined,
    status:
      statusFilter !== ALL_STATUSES
        ? (statusFilter as TenantStatus)
        : undefined,
    page: page + 1,
  })

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(0)
  }, [])

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value)
    setPage(0)
  }, [])

  const handleInviteTenant = useCallback(() => {
    router.push(TENANT_ROUTES.NEW)
  }, [router])

  const tenants = result?.data ?? []
  const totalTenants = result?.total ?? 0

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
        title="Tenants"
        description={`${totalTenants} ${totalTenants === 1 ? "tenant" : "tenants"} in your portfolio`}
      >
        <Button onClick={handleInviteTenant}>
          <Plus className="h-4 w-4" />
          Invite Tenant
        </Button>
      </PageHeader>

      {totalTenants === 0 && !search && statusFilter === ALL_STATUSES ? (
        <EmptyState
          icon={Users}
          title="No tenants yet"
          description="Invite your first tenant to start managing your portfolio."
          actionLabel="Invite Tenant"
          onAction={handleInviteTenant}
        />
      ) : (
        <>
          <div className="flex flex-1 items-center gap-3">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search tenants..."
              className="w-full max-w-xs"
            />
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
                {(
                  Object.entries(TENANT_STATUS_LABELS) as [
                    TenantStatus,
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

          <DataTable
            columns={tenantColumns}
            data={tenants}
            pageCount={result?.pageCount ?? 1}
            page={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
