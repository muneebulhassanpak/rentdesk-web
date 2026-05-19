export const ALL_STATUSES = "all"
export const ALL_PROPERTIES = "all"

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)

export const getCurrentMonth = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

export const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split("-")
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export const getMonthOptions = (
  count: number = 12
): { value: string; label: string }[] => {
  const options: { value: string; label: string }[] = []
  const now = new Date()
  for (let i = -1; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const value = `${year}-${month}`
    const label = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    options.push({ value, label })
  }
  return options
}
