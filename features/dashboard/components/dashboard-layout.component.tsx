"use client"

import { AuthGuard } from "@/shared/components/auth-guard.component"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"

import { AppSidebar } from "./app-sidebar.component"
import { Topbar } from "./topbar.component"

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
