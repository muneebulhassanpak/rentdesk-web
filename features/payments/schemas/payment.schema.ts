import { z } from "zod"

export const recordPaymentSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  method: z.enum(["cash", "bank_transfer", "check", "stripe", "other"], {
    message: "Payment method is required",
  }),
  date: z.string().min(1, "Payment date is required"),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

export type RecordPaymentFormValues = z.infer<typeof recordPaymentSchema>
