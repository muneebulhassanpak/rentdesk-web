import { use } from "react"

import TenantEditPage from "@/features/tenants/pages/tenant-edit.page"

export default function Page({
  params,
}: {
  params: Promise<{ tenantId: string }>
}) {
  const { tenantId } = use(params)
  return <TenantEditPage tenantId={tenantId} />
}
