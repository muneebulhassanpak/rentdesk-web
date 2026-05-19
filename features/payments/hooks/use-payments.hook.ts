import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type {
  CollectionSummary,
  Payment,
  PaymentDetail,
  RecordPaymentRequest,
  RentRoll,
} from "@/shared/types/payment.types"
import type { PaginatedResponse } from "@/shared/types/property.types"

import {
  createStripeCheckout,
  getCollectionSummary,
  getLeasePayments,
  getPayment,
  getPayments,
  type GetPaymentsParams,
  getPropertyOptions,
  getRentRoll,
  recordPayment,
  waiveLateFee,
  waivePayment,
} from "../services/payments.service"

type OptionItem = { value: string; label: string }

export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (orgId: string, params: GetPaymentsParams) =>
    [...paymentKeys.lists(), orgId, params] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  summary: (month?: string) => [...paymentKeys.all, "summary", month] as const,
  leasePayments: (leaseId: string) =>
    [...paymentKeys.all, "lease", leaseId] as const,
  rentRoll: (propertyId: string, month?: string) =>
    [...paymentKeys.all, "rentRoll", propertyId, month] as const,
  propertyOptions: () => [...paymentKeys.all, "propertyOptions"] as const,
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const usePayments = (orgId: string, params: GetPaymentsParams) =>
  useQuery<PaginatedResponse<Payment>>({
    queryKey: paymentKeys.list(orgId, params),
    queryFn: () => getPayments(orgId, params),
    enabled: !!orgId,
  })

export const usePayment = (paymentId: string) =>
  useQuery<PaymentDetail | null>({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => getPayment(paymentId),
    enabled: !!paymentId,
  })

export const useCollectionSummary = (month?: string) =>
  useQuery<CollectionSummary>({
    queryKey: paymentKeys.summary(month),
    queryFn: () => getCollectionSummary(month),
  })

export const useLeasePayments = (leaseId: string) =>
  useQuery<Payment[]>({
    queryKey: paymentKeys.leasePayments(leaseId),
    queryFn: () => getLeasePayments(leaseId),
    enabled: !!leaseId,
  })

export const useRentRoll = (propertyId: string, month?: string) =>
  useQuery<RentRoll>({
    queryKey: paymentKeys.rentRoll(propertyId, month),
    queryFn: () => getRentRoll(propertyId, month),
    enabled: !!propertyId,
  })

export const usePropertyOptions = () =>
  useQuery<OptionItem[]>({
    queryKey: paymentKeys.propertyOptions(),
    queryFn: getPropertyOptions,
  })

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useRecordPayment = (paymentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RecordPaymentRequest) => recordPayment(paymentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(paymentId) })
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.summary() })
    },
  })
}

export const useWaivePayment = (paymentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => waivePayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(paymentId) })
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.summary() })
    },
  })
}

export const useWaiveLateFee = (paymentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => waiveLateFee(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(paymentId) })
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() })
    },
  })
}

export const useCreateStripeCheckout = (paymentId: string) => {
  return useMutation({
    mutationFn: () => createStripeCheckout(paymentId),
  })
}
