"use client"

import Link from "next/link"

import { Mail, Pencil, Phone, ShieldAlert, UserX } from "lucide-react"

import { StatusBadge } from "@/shared/components/status-badge.component"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { UserAvatar } from "@/shared/components/user-avatar.component"
import { TENANT_ROUTES } from "@/shared/constants/routes.constants"
import type { TenantDetail, TenantStatus } from "@/shared/types/tenant.types"
import { TENANT_STATUS_LABELS } from "@/shared/types/tenant.types"

type TenantProfileCardProps = {
  tenant: TenantDetail
  deactivateButton: React.ReactNode
}

const STATUS_VARIANT_MAP: Record<TenantStatus, "success" | "info" | "default"> =
  {
    active: "success",
    invited: "info",
    inactive: "default",
  }

export const TenantProfileCard = ({
  tenant,
  deactivateButton,
}: TenantProfileCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <UserAvatar
            fullName={tenant.fullName}
            avatarUrl={tenant.avatarUrl}
            size="lg"
          />
          <div className="grid gap-1">
            <h2 className="text-lg font-semibold">{tenant.fullName}</h2>
            <StatusBadge
              label={TENANT_STATUS_LABELS[tenant.status]}
              variant={STATUS_VARIANT_MAP[tenant.status]}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={TENANT_ROUTES.EDIT(tenant.id)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          {tenant.status !== "inactive" && deactivateButton}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{tenant.email}</span>
        </div>
        {tenant.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{tenant.phone}</span>
          </div>
        )}
        {(tenant.emergencyContactName || tenant.emergencyContactPhone) && (
          <div className="flex items-center gap-2 text-sm">
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Emergency:</span>
            <span>
              {[tenant.emergencyContactName, tenant.emergencyContactPhone]
                .filter(Boolean)
                .join(" — ")}
            </span>
          </div>
        )}
        {!tenant.phone &&
          !tenant.emergencyContactName &&
          !tenant.emergencyContactPhone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserX className="h-4 w-4" />
              <span>No additional contact information</span>
            </div>
          )}
      </CardContent>
    </Card>
  )
}
