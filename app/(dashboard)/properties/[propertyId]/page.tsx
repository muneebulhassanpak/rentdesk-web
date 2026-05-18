import { use } from "react"

import PropertyDetailPage from "@/features/properties/pages/property-detail.page"

export default function Page({
  params,
}: {
  params: Promise<{ propertyId: string }>
}) {
  const { propertyId } = use(params)
  return <PropertyDetailPage propertyId={propertyId} />
}
