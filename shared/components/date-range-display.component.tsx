const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

type DateRangeDisplayProps = {
  startDate: string
  endDate: string
  className?: string
}

export const DateRangeDisplay = ({
  startDate,
  endDate,
  className,
}: DateRangeDisplayProps) => {
  const start = formatter.format(new Date(startDate))
  const end = formatter.format(new Date(endDate))

  return <span className={className}>{`${start} – ${end}`}</span>
}
