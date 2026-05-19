import { describe, expect, it } from "vitest"

import { registerSchema } from "./register.schema"

describe("registerSchema", () => {
  const validData = {
    fullName: "John Doe",
    email: "john@example.com",
    orgName: "Acme Properties",
    password: "securepass123",
    confirmPassword: "securepass123",
  }

  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects empty full name", () => {
    const result = registerSchema.safeParse({ ...validData, fullName: "" })
    expect(result.success).toBe(false)
  })

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      ...validData,
      email: "not-email",
    })
    expect(result.success).toBe(false)
  })

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "short",
      confirmPassword: "short",
    })
    expect(result.success).toBe(false)
  })

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "different123",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."))
      expect(paths).toContain("confirmPassword")
    }
  })

  it("rejects empty org name", () => {
    const result = registerSchema.safeParse({ ...validData, orgName: "" })
    expect(result.success).toBe(false)
  })
})
