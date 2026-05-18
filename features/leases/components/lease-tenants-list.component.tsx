import Link from "next/link"

import { Badge } from "@/shared/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { UserAvatar } from "@/shared/components/user-avatar.component"
import { TENANT_ROUTES } from "@/shared/constants/routes.constants"
import type { LeaseTenant } from "@/shared/types/lease.types"

type LeaseTenantsListProps = {
  tenants: LeaseTenant[]
}

export const LeaseTenantsList = ({ tenants }: LeaseTenantsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenants ({tenants.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {tenants.map((tenant) => {
            const name = tenant.fullName ?? "Tenant"
            return (
              <div key={tenant.tenantId} className="flex items-center gap-3">
                <UserAvatar fullName={name} avatarUrl={tenant.avatarUrl} />
                <div className="grid gap-0.5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={TENANT_ROUTES.DETAIL(tenant.tenantId)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {name}
                    </Link>
                    {tenant.isPrimary && (
                      <Badge variant="secondary">Primary</Badge>
                    )}
                  </div>
                  {tenant.email && (
                    <span className="text-sm text-muted-foreground">
                      {tenant.email}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
