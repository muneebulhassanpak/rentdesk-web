import { use } from "react"

import PaymentDetailPage from "@/features/payments/pages/payment-detail.page"

export default function Page({
  params,
}: {
  params: Promise<{ paymentId: string }>
}) {
  const { paymentId } = use(params)
  return <PaymentDetailPage paymentId={paymentId} />
}
