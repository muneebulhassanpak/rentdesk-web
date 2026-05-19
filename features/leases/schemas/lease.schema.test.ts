import { describe, expect, it } from "vitest"

import { createLeaseSchema } from "./lease.schema"

describe("createLeaseSchema", () => {
  const validData = {
    propertyId: "prop-1",
    unitId: "unit-1",
    tenantIds: ["tenant-1"],
    primaryTenantId: "tenant-1",
    startDate: "2026-01-01",
    endDate: "2027-01-01",
    monthlyRent: 1500,
    securityDeposit: 1500,
    paymentDueDay: 1,
  }

  it("accepts valid lease data", () => {
    const result = createLeaseSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects end date before start date", () => {
    const result = createLeaseSchema.safeParse({
      ...validData,
      endDate: "2025-12-31",
    })
    expect(result.success).toBe(false)
  })

  it("rejects primary tenant not in tenant list", () => {
    const result = createLeaseSchema.safeParse({
      ...validData,
      primaryTenantId: "tenant-99",
    })
    expect(result.success).toBe(false)
  })

  it("rejects zero rent", () => {
    const result = createLeaseSchema.safeParse({
      ...validData,
      monthlyRent: 0,
    })
    expect(result.success).toBe(false)
  })

  it("rejects negative deposit", () => {
    const result = createLeaseSchema.safeParse({
      ...validData,
      securityDeposit: -100,
    })
    expect(result.success).toBe(false)
  })

  it("rejects due day outside 1-28 range", () => {
    expect(
      createLeaseSchema.safeParse({ ...validData, paymentDueDay: 0 }).success
    ).toBe(false)
    expect(
      createLeaseSchema.safeParse({ ...validData, paymentDueDay: 29 }).success
    ).toBe(false)
  })

  it("rejects empty tenant list", () => {
    const result = createLeaseSchema.safeParse({
      ...validData,
      tenantIds: [],
      primaryTenantId: "",
    })
    expect(result.success).toBe(false)
  })
})
