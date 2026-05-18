import { use } from "react"

import UnitCreatePage from "@/features/properties/pages/unit-create.page"

export default function Page({
  params,
}: {
  params: Promise<{ propertyId: string }>
}) {
  const { propertyId } = use(params)
  return <UnitCreatePage propertyId={propertyId} />
}
