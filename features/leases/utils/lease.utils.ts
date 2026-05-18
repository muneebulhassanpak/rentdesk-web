export const MAX_DUE_DAY = 28

export const ALL_STATUSES = "all"
export const ALL_PROPERTIES = "all"

export const DUE_DAY_OPTIONS = Array.from({ length: MAX_DUE_DAY }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}))

export const getNextDay = (dateStr: string): string => {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + 1)
  return date.toISOString().split("T")[0]
}

export const addOneYear = (dateStr: string): string => {
  const date = new Date(dateStr)
  date.setFullYear(date.getFullYear() + 1)
  return date.toISOString().split("T")[0]
}
