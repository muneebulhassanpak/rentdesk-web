import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type {
  CreateLeaseRequest,
  Lease,
  LeaseDetail,
  RenewLeaseRequest,
  TerminateLeaseRequest,
  UpdateLeaseRequest,
} from "@/shared/types/lease.types"
import type { PaginatedResponse } from "@/shared/types/property.types"

import {
  activateLease,
  createLease,
  getLease,
  getLeases,
  type GetLeasesParams,
  getPropertyOptions,
  getTenantOptions,
  getUnitOptionsForProperty,
  renewLease,
  terminateLease,
  updateLease,
} from "../services/leases.service"

type OptionItem = { value: string; label: string }

export const leaseKeys = {
  all: ["leases"] as const,
  lists: () => [...leaseKeys.all, "list"] as const,
  list: (orgId: string, params: GetLeasesParams) =>
    [...leaseKeys.lists(), orgId, params] as const,
  details: () => [...leaseKeys.all, "detail"] as const,
  detail: (id: string) => [...leaseKeys.details(), id] as const,
  propertyOptions: () => [...leaseKeys.all, "propertyOptions"] as const,
  tenantOptions: () => [...leaseKeys.all, "tenantOptions"] as const,
  unitOptions: (propertyId: string) =>
    [...leaseKeys.all, "unitOptions", propertyId] as const,
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useLeases = (orgId: string, params: GetLeasesParams) =>
  useQuery<PaginatedResponse<Lease>>({
    queryKey: leaseKeys.list(orgId, params),
    queryFn: () => getLeases(orgId, params),
    enabled: !!orgId,
  })

export const useLease = (leaseId: string) =>
  useQuery<LeaseDetail | null>({
    queryKey: leaseKeys.detail(leaseId),
    queryFn: () => getLease(leaseId),
    enabled: !!leaseId,
  })

export const usePropertyOptions = () =>
  useQuery<OptionItem[]>({
    queryKey: leaseKeys.propertyOptions(),
    queryFn: getPropertyOptions,
  })

export const useTenantOptions = () =>
  useQuery<OptionItem[]>({
    queryKey: leaseKeys.tenantOptions(),
    queryFn: getTenantOptions,
  })

export const useUnitOptions = (propertyId: string) =>
  useQuery<OptionItem[]>({
    queryKey: leaseKeys.unitOptions(propertyId),
    queryFn: () => getUnitOptionsForProperty(propertyId),
    enabled: !!propertyId,
  })

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useCreateLease = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLeaseRequest) => createLease(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.lists() })
    },
  })
}

export const useUpdateLease = (leaseId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateLeaseRequest) => updateLease(leaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.detail(leaseId) })
      queryClient.invalidateQueries({ queryKey: leaseKeys.lists() })
    },
  })
}

export const useActivateLease = (leaseId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => activateLease(leaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.detail(leaseId) })
      queryClient.invalidateQueries({ queryKey: leaseKeys.lists() })
    },
  })
}

export const useRenewLease = (leaseId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RenewLeaseRequest) => renewLease(leaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.lists() })
    },
  })
}

export const useTerminateLease = (leaseId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TerminateLeaseRequest) => terminateLease(leaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.detail(leaseId) })
      queryClient.invalidateQueries({ queryKey: leaseKeys.lists() })
    },
  })
}
