import { DashboardLayout } from "@/features/dashboard"

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
