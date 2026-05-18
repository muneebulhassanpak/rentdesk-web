import { use } from "react"

import LeaseRenewPage from "@/features/leases/pages/lease-renew.page"

export default function Page({
  params,
}: {
  params: Promise<{ leaseId: string }>
}) {
  const { leaseId } = use(params)
  return <LeaseRenewPage leaseId={leaseId} />
}
