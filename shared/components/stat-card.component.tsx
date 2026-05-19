import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/shared/components/ui/card"
import { cn } from "@/shared/lib/utils"

type StatCardProps = {
  label: string
  value: string
  icon?: LucideIcon
  trend?: string
  trendUp?: boolean
  className?: string
}

export const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  className,
}: StatCardProps) => {
  return (
    <Card size="sm" className={cn("gap-0", className)}>
      <CardContent className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trendUp ? "text-emerald-600" : "text-red-600"
              )}
            >
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-muted p-2.5">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
