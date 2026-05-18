import { use } from "react"

import UnitDetailPage from "@/features/properties/pages/unit-detail.page"

export default function Page({
  params,
}: {
  params: Promise<{ propertyId: string; unitId: string }>
}) {
  const { propertyId, unitId } = use(params)
  return <UnitDetailPage propertyId={propertyId} unitId={unitId} />
}
