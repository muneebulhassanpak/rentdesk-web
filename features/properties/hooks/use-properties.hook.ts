import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type {
  CreatePropertyRequest,
  CreateUnitRequest,
  PaginatedResponse,
  Property,
  Unit,
  UpdatePropertyRequest,
  UpdateUnitRequest,
} from "@/shared/types/property.types"

import {
  archiveProperty,
  createProperty,
  createUnit,
  getProperties,
  type GetPropertiesParams,
  getProperty,
  getUnit,
  getUnits,
  updateProperty,
  updateUnit,
} from "../services/properties.service"

export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (orgId: string, params: GetPropertiesParams) =>
    [...propertyKeys.lists(), orgId, params] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  units: (propertyId: string) =>
    [...propertyKeys.all, "units", propertyId] as const,
  unit: (unitId: string) => [...propertyKeys.all, "unit", unitId] as const,
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useProperties = (orgId: string, params: GetPropertiesParams) =>
  useQuery<PaginatedResponse<Property>>({
    queryKey: propertyKeys.list(orgId, params),
    queryFn: () => getProperties(orgId, params),
    enabled: !!orgId,
  })

export const useProperty = (propertyId: string) =>
  useQuery<Property | null>({
    queryKey: propertyKeys.detail(propertyId),
    queryFn: () => getProperty(propertyId),
    enabled: !!propertyId,
  })

export const useUnits = (propertyId: string) =>
  useQuery<Unit[]>({
    queryKey: propertyKeys.units(propertyId),
    queryFn: () => getUnits(propertyId),
    enabled: !!propertyId,
  })

export const useUnit = (unitId: string) =>
  useQuery<Unit | null>({
    queryKey: propertyKeys.unit(unitId),
    queryFn: () => getUnit(unitId),
    enabled: !!unitId,
  })

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useCreateProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePropertyRequest) => createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
    },
  })
}

export const useUpdateProperty = (propertyId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdatePropertyRequest) =>
      updateProperty(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(propertyId),
      })
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
    },
  })
}

export const useArchiveProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (propertyId: string) => archiveProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
    },
  })
}

export const useCreateUnit = (propertyId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUnitRequest) => createUnit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: propertyKeys.units(propertyId),
      })
      queryClient.invalidateQueries({
        queryKey: propertyKeys.detail(propertyId),
      })
    },
  })
}

export const useUpdateUnit = (propertyId: string, unitId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUnitRequest) => updateUnit(unitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.unit(unitId) })
      queryClient.invalidateQueries({
        queryKey: propertyKeys.units(propertyId),
      })
    },
  })
}
