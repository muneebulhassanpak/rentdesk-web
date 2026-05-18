import { use } from "react"

import LeaseEditPage from "@/features/leases/pages/lease-edit.page"

export default function Page({
  params,
}: {
  params: Promise<{ leaseId: string }>
}) {
  const { leaseId } = use(params)
  return <LeaseEditPage leaseId={leaseId} />
}
