import { z } from "zod"

const MAX_DUE_DAY = 28

export const createLeaseSchema = z
  .object({
    propertyId: z.string().min(1, "Property is required"),
    unitId: z.string().min(1, "Unit is required"),
    tenantIds: z.array(z.string()).min(1, "At least one tenant is required"),
    primaryTenantId: z.string().min(1, "Primary tenant is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    monthlyRent: z.number().positive("Rent must be greater than 0"),
    securityDeposit: z.number().min(0, "Deposit cannot be negative"),
    paymentDueDay: z
      .number()
      .int()
      .min(1, "Due day must be 1–28")
      .max(MAX_DUE_DAY, "Due day must be 1–28"),
    notes: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine((data) => data.tenantIds.includes(data.primaryTenantId), {
    message: "Primary tenant must be one of the selected tenants",
    path: ["primaryTenantId"],
  })

export type CreateLeaseFormValues = z.infer<typeof createLeaseSchema>

export const editLeaseSchema = z
  .object({
    tenantIds: z.array(z.string()).min(1, "At least one tenant is required"),
    primaryTenantId: z.string().min(1, "Primary tenant is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    monthlyRent: z.number().positive("Rent must be greater than 0"),
    securityDeposit: z.number().min(0, "Deposit cannot be negative"),
    paymentDueDay: z
      .number()
      .int()
      .min(1, "Due day must be 1–28")
      .max(MAX_DUE_DAY, "Due day must be 1–28"),
    notes: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })

export type EditLeaseFormValues = z.infer<typeof editLeaseSchema>

export const renewLeaseSchema = z
  .object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    monthlyRent: z.number().positive("Rent must be greater than 0"),
    securityDeposit: z.number().min(0, "Deposit cannot be negative"),
    paymentDueDay: z
      .number()
      .int()
      .min(1, "Due day must be 1–28")
      .max(MAX_DUE_DAY, "Due day must be 1–28"),
    notes: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })

export type RenewLeaseFormValues = z.infer<typeof renewLeaseSchema>

export const terminateLeaseSchema = z.object({
  terminationDate: z.string().min(1, "Termination date is required"),
  reason: z.string().optional(),
  depositSettlementNotes: z.string().optional(),
})

export type TerminateLeaseFormValues = z.infer<typeof terminateLeaseSchema>
