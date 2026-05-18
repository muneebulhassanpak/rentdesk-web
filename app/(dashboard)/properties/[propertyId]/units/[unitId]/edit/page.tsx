import { use } from "react"

import UnitEditPage from "@/features/properties/pages/unit-edit.page"

export default function Page({
  params,
}: {
  params: Promise<{ propertyId: string; unitId: string }>
}) {
  const { propertyId, unitId } = use(params)
  return <UnitEditPage propertyId={propertyId} unitId={unitId} />
}
