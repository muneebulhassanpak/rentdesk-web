import { z } from "zod"

export const unitSchema = z.object({
  label: z.string().min(1, "Unit label is required"),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  sqft: z.number().int().min(0).optional(),
  monthlyRent: z.number().min(0, "Rent must be positive"),
  securityDeposit: z.number().min(0, "Deposit must be positive"),
  status: z.enum(["vacant", "occupied", "under_maintenance", "listed"]),
  description: z.string().optional(),
})

export type UnitFormValues = z.infer<typeof unitSchema>
