import {
  BarChart3,
  Building2,
  ClipboardList,
  CreditCard,
  FileText,
  HardHat,
  Home,
  type LucideIcon,
  ScrollText,
  Settings,
  Ticket,
  User,
  Users,
  Wrench,
} from "lucide-react"

import type { Role } from "@/shared/types/auth.types"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const LANDLORD_NAV: NavItem[] = [
  { label: "Dashboard", href: "/landlord", icon: Home },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Tenants", href: "/tenants", icon: Users },
  { label: "Leases", href: "/leases", icon: ClipboardList },
  { label: "Payments", href: "/landlord/payments", icon: CreditCard },
  { label: "Maintenance", href: "/landlord/maintenance", icon: Wrench },
  { label: "Vendors", href: "/landlord/vendors", icon: HardHat },
  { label: "Documents", href: "/landlord/documents", icon: FileText },
  { label: "Reports", href: "/landlord/reports", icon: BarChart3 },
  { label: "Team", href: "/landlord/team", icon: Users },
  { label: "Audit Log", href: "/landlord/audit-log", icon: ScrollText },
  { label: "Settings", href: "/landlord/settings", icon: Settings },
]

const MANAGER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/manager", icon: Home },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Tenants", href: "/tenants", icon: Users },
  { label: "Leases", href: "/leases", icon: ClipboardList },
  { label: "Payments", href: "/manager/payments", icon: CreditCard },
  { label: "Maintenance", href: "/manager/maintenance", icon: Wrench },
  { label: "Vendors", href: "/manager/vendors", icon: HardHat },
  { label: "Documents", href: "/manager/documents", icon: FileText },
  { label: "Reports", href: "/manager/reports", icon: BarChart3 },
  { label: "Settings", href: "/manager/settings", icon: Settings },
]

const TENANT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/tenant", icon: Home },
  { label: "My Lease", href: "/tenant/lease", icon: ClipboardList },
  { label: "Payments", href: "/tenant/payments", icon: CreditCard },
  { label: "Maintenance", href: "/tenant/maintenance", icon: Wrench },
  { label: "Documents", href: "/tenant/documents", icon: FileText },
]

const VENDOR_NAV: NavItem[] = [
  { label: "Dashboard", href: "/vendor", icon: Home },
  { label: "My Tickets", href: "/vendor/tickets", icon: Ticket },
  { label: "Profile", href: "/vendor/profile", icon: User },
]

export const NAVIGATION_MAP: Record<Role, NavItem[]> = {
  landlord: LANDLORD_NAV,
  manager: MANAGER_NAV,
  tenant: TENANT_NAV,
  vendor: VENDOR_NAV,
}
