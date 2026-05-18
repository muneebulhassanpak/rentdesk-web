import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { PaginatedResponse } from "@/shared/types/property.types"
import type {
  InviteTenantRequest,
  Tenant,
  TenantDetail,
  UpdateTenantRequest,
} from "@/shared/types/tenant.types"

import {
  createTenant,
  deactivateTenant,
  getTenant,
  getTenants,
  type GetTenantsParams,
  updateTenant,
} from "../services/tenants.service"

export const tenantKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantKeys.all, "list"] as const,
  list: (orgId: string, params: GetTenantsParams) =>
    [...tenantKeys.lists(), orgId, params] as const,
  details: () => [...tenantKeys.all, "detail"] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useTenants = (orgId: string, params: GetTenantsParams) =>
  useQuery<PaginatedResponse<Tenant>>({
    queryKey: tenantKeys.list(orgId, params),
    queryFn: () => getTenants(orgId, params),
    enabled: !!orgId,
  })

export const useTenant = (tenantId: string) =>
  useQuery<TenantDetail | null>({
    queryKey: tenantKeys.detail(tenantId),
    queryFn: () => getTenant(tenantId),
    enabled: !!tenantId,
  })

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useCreateTenant = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InviteTenantRequest) => createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() })
    },
  })
}

export const useUpdateTenant = (tenantId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateTenantRequest) => updateTenant(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tenantKeys.detail(tenantId),
      })
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() })
    },
  })
}

export const useDeactivateTenant = (tenantId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deactivateTenant(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tenantKeys.detail(tenantId),
      })
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() })
    },
  })
}
