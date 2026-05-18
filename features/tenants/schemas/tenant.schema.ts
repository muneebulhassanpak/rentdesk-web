import { z } from "zod"

export const inviteTenantSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
})

export type InviteTenantFormValues = z.infer<typeof inviteTenantSchema>

export const editTenantSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
})

export type EditTenantFormValues = z.infer<typeof editTenantSchema>
