import Link from "next/link"

import { Building2, Home, MapPin } from "lucide-react"

import { StatusBadge } from "@/shared/components/status-badge.component"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import type { Property } from "@/shared/types/property.types"
import { PROPERTY_TYPE_LABELS } from "@/shared/types/property.types"

type PropertyCardProps = {
  property: Property
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const address = [
    property.address.line1,
    property.address.city,
    property.address.state,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                {property.type === "commercial" ? (
                  <Building2 className="h-4 w-4 text-primary" />
                ) : (
                  <Home className="h-4 w-4 text-primary" />
                )}
              </div>
              <div>
                <p className="leading-tight font-medium">{property.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {address}
                </p>
              </div>
            </div>
            <StatusBadge label={PROPERTY_TYPE_LABELS[property.type]} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Units</p>
              <p className="font-medium">{property.unitCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Occupancy</p>
              <p className="font-medium">{property.occupancyPercent}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rent Roll</p>
              <p className="font-medium">
                ${property.monthlyRentRoll.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Open Tickets</p>
              <p className="font-medium">{property.openTickets}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
