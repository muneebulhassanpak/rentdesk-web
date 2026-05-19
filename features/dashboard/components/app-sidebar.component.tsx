"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Building2, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import { useAuth } from "@/shared/hooks/use-auth.hook"

import { NAVIGATION_MAP } from "../constants/navigation.constants"

export const AppSidebar = () => {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const navItems = NAVIGATION_MAP[user.role]

  return (
    <Sidebar data-testid="app-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href={`/${user.role}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="grid leading-tight">
            <span className="text-sm font-semibold">
              {user.orgName ?? "RentDesk"}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {user.role}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== `/${user.role}` &&
                    pathname.startsWith(item.href))

                return (
                  <SidebarMenuItem
                    key={item.href}
                    data-testid={`nav-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.disabled ? (
                      <SidebarMenuButton
                        disabled
                        className="pointer-events-none opacity-50"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        <span className="ml-auto text-[10px] font-medium text-muted-foreground">
                          Soon
                        </span>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
