import { Building2, DollarSign, Home, Wrench } from "lucide-react"

import { Card, CardContent } from "@/shared/components/ui/card"
import type { Property } from "@/shared/types/property.types"

type PropertyStatsProps = {
  property: Property
}

const stats = (property: Property) => [
  {
    label: "Total Units",
    value: property.unitCount,
    icon: Home,
  },
  {
    label: "Occupied",
    value: property.occupiedCount,
    icon: Building2,
  },
  {
    label: "Vacant",
    value: property.vacantCount,
    icon: Home,
  },
  {
    label: "Maintenance",
    value: property.maintenanceCount,
    icon: Wrench,
  },
  {
    label: "Occupancy",
    value: `${property.occupancyPercent}%`,
    icon: Building2,
  },
  {
    label: "Rent Roll",
    value: `$${property.monthlyRentRoll.toLocaleString()}`,
    icon: DollarSign,
  },
]

export const PropertyStats = ({ property }: PropertyStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {stats(property).map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg leading-tight font-semibold">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
