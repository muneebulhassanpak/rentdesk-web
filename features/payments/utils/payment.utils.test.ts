import { describe, expect, it } from "vitest"

import {
  formatCurrency,
  formatMonth,
  getCurrentMonth,
  getMonthOptions,
} from "./payment.utils"

describe("formatCurrency", () => {
  it("formats whole dollars", () => {
    expect(formatCurrency(1500)).toBe("$1,500.00")
  })

  it("formats cents", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56")
  })

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00")
  })

  it("formats negative amounts", () => {
    expect(formatCurrency(-50)).toBe("-$50.00")
  })
})

describe("getCurrentMonth", () => {
  it("returns YYYY-MM format", () => {
    const result = getCurrentMonth()
    expect(result).toMatch(/^\d{4}-\d{2}$/)
  })

  it("matches current date", () => {
    const now = new Date()
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    expect(getCurrentMonth()).toBe(expected)
  })
})

describe("formatMonth", () => {
  it("formats YYYY-MM to readable string", () => {
    expect(formatMonth("2026-01")).toBe("January 2026")
  })

  it("handles December", () => {
    expect(formatMonth("2025-12")).toBe("December 2025")
  })
})

describe("getMonthOptions", () => {
  it("returns default 13 options (1 future + 12 past)", () => {
    const options = getMonthOptions()
    expect(options).toHaveLength(13)
  })

  it("returns custom count + 1", () => {
    const options = getMonthOptions(3)
    expect(options).toHaveLength(4)
  })

  it("each option has value and label", () => {
    const options = getMonthOptions(2)
    for (const option of options) {
      expect(option.value).toMatch(/^\d{4}-\d{2}$/)
      expect(option.label).toBeTruthy()
    }
  })

  it("first option is next month", () => {
    const options = getMonthOptions()
    const next = new Date()
    next.setMonth(next.getMonth() + 1)
    const expected = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`
    expect(options[0].value).toBe(expected)
  })
})
