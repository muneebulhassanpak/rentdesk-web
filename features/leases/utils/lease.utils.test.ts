import { describe, expect, it } from "vitest"

import { addOneYear, getNextDay } from "./lease.utils"

describe("getNextDay", () => {
  it("returns the next day", () => {
    expect(getNextDay("2026-01-15")).toBe("2026-01-16")
  })

  it("crosses month boundaries", () => {
    expect(getNextDay("2026-01-31")).toBe("2026-02-01")
  })

  it("crosses year boundaries", () => {
    expect(getNextDay("2025-12-31")).toBe("2026-01-01")
  })
})

describe("addOneYear", () => {
  it("adds one year to a date", () => {
    expect(addOneYear("2026-01-15")).toBe("2027-01-15")
  })

  it("handles leap year Feb 29 → Feb 28", () => {
    // 2024 is a leap year, 2025 is not
    const result = addOneYear("2024-02-29")
    expect(result).toBe("2025-03-01")
  })
})
