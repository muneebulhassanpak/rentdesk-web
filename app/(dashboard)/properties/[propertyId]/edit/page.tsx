import { use } from "react"

import PropertyEditPage from "@/features/properties/pages/property-edit.page"

export default function Page({
  params,
}: {
  params: Promise<{ propertyId: string }>
}) {
  const { propertyId } = use(params)
  return <PropertyEditPage propertyId={propertyId} />
}
