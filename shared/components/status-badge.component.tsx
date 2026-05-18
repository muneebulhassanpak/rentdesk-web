import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/lib/utils"

type StatusBadgeVariant = "success" | "info" | "warning" | "purple" | "default"

const VARIANT_CLASSES: Record<StatusBadgeVariant, string> = {
  success:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  warning:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  purple:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  default: "",
}

type StatusBadgeProps = {
  label: string
  variant?: StatusBadgeVariant
  className?: string
}

export const StatusBadge = ({
  label,
  variant = "default",
  className,
}: StatusBadgeProps) => {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-none font-medium",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {label}
    </Badge>
  )
}
