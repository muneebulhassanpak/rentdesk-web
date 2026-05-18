import { z } from "zod"

const MIN_YEAR = 1800

export const addressSchema = z.object({
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
})

export const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  type: z.enum(["single_family", "multi_unit", "condo", "commercial"]),
  address: addressSchema,
  coverPhotoUrl: z.string().optional(),
  yearBuilt: z
    .number()
    .int()
    .min(MIN_YEAR, `Year must be after ${MIN_YEAR}`)
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional()
    .or(z.literal(undefined)),
  notes: z.string().optional(),
})

export type PropertyFormValues = z.infer<typeof propertySchema>
