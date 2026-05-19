import { describe, expect, it } from "vitest"

import { recordPaymentSchema } from "./payment.schema"

describe("recordPaymentSchema", () => {
  const validData = {
    amount: 1200,
    method: "cash" as const,
    date: "2026-05-15",
    reference: "",
    notes: "",
  }

  it("accepts valid payment data", () => {
    const result = recordPaymentSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects zero amount", () => {
    const result = recordPaymentSchema.safeParse({ ...validData, amount: 0 })
    expect(result.success).toBe(false)
  })

  it("rejects negative amount", () => {
    const result = recordPaymentSchema.safeParse({ ...validData, amount: -100 })
    expect(result.success).toBe(false)
  })

  it("rejects missing method", () => {
    const result = recordPaymentSchema.safeParse({
      ...validData,
      method: undefined,
    })
    expect(result.success).toBe(false)
  })

  it("rejects invalid method", () => {
    const result = recordPaymentSchema.safeParse({
      ...validData,
      method: "bitcoin",
    })
    expect(result.success).toBe(false)
  })

  it("rejects empty date", () => {
    const result = recordPaymentSchema.safeParse({ ...validData, date: "" })
    expect(result.success).toBe(false)
  })

  it("accepts all valid payment methods", () => {
    const methods = ["cash", "bank_transfer", "check", "stripe", "other"]
    for (const method of methods) {
      const result = recordPaymentSchema.safeParse({ ...validData, method })
      expect(result.success).toBe(true)
    }
  })

  it("allows optional reference and notes", () => {
    const result = recordPaymentSchema.safeParse({
      amount: validData.amount,
      method: validData.method,
      date: validData.date,
    })
    expect(result.success).toBe(true)
  })
})
