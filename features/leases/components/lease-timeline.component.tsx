import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

const FULL_PERCENT = 100

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

type LeaseTimelineProps = {
  startDate: string
  endDate: string
}

export const LeaseTimeline = ({ startDate, endDate }: LeaseTimelineProps) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const now = new Date()

  const totalDuration = end.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()

  const isWithinRange = now >= start && now <= end
  const isBeforeStart = now < start
  const isAfterEnd = now > end

  let progressPercent = 0
  if (isAfterEnd) {
    progressPercent = FULL_PERCENT
  } else if (isWithinRange && totalDuration > 0) {
    progressPercent = Math.round((elapsed / totalDuration) * FULL_PERCENT)
  }

  let todayPosition = 0
  if (isWithinRange && totalDuration > 0) {
    todayPosition = (elapsed / totalDuration) * FULL_PERCENT
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="relative">
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {isWithinRange && (
            <div
              className="absolute top-0 h-3 w-0.5 bg-foreground"
              style={{ left: `${todayPosition}%` }}
              title="Today"
            />
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="grid gap-0.5">
            <span className="font-medium">Start</span>
            <span className="text-muted-foreground">
              {dateFormatter.format(start)}
            </span>
          </div>

          {isWithinRange && (
            <div className="grid gap-0.5 text-center">
              <span className="font-medium">Today</span>
              <span className="text-muted-foreground">
                {progressPercent}% elapsed
              </span>
            </div>
          )}

          {isBeforeStart && (
            <div className="grid gap-0.5 text-center">
              <span className="text-sm text-muted-foreground">
                Starts in the future
              </span>
            </div>
          )}

          {isAfterEnd && (
            <div className="grid gap-0.5 text-center">
              <span className="text-sm text-muted-foreground">Expired</span>
            </div>
          )}

          <div className="grid gap-0.5 text-right">
            <span className="font-medium">End</span>
            <span className="text-muted-foreground">
              {dateFormatter.format(end)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
