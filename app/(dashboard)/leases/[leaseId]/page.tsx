import { use } from "react"

import LeaseDetailPage from "@/features/leases/pages/lease-detail.page"

export default function Page({
  params,
}: {
  params: Promise<{ leaseId: string }>
}) {
  const { leaseId } = use(params)
  return <LeaseDetailPage leaseId={leaseId} />
}
