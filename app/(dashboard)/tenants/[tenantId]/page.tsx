import { use } from "react"

import TenantDetailPage from "@/features/tenants/pages/tenant-detail.page"

export default function Page({
  params,
}: {
  params: Promise<{ tenantId: string }>
}) {
  const { tenantId } = use(params)
  return <TenantDetailPage tenantId={tenantId} />
}
