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
  disabled?: boolean
}

const LANDLORD_NAV: NavItem[] = [
  { label: "Dashboard", href: "/landlord", icon: Home },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Tenants", href: "/tenants", icon: Users },
  { label: "Leases", href: "/leases", icon: ClipboardList },
  { label: "Payments", href: "/payments", icon: CreditCard },
  {
    label: "Maintenance",
    href: "/landlord/maintenance",
    icon: Wrench,
    disabled: true,
  },
  {
    label: "Vendors",
    href: "/landlord/vendors",
    icon: HardHat,
    disabled: true,
  },
  {
    label: "Documents",
    href: "/landlord/documents",
    icon: FileText,
    disabled: true,
  },
  {
    label: "Reports",
    href: "/landlord/reports",
    icon: BarChart3,
    disabled: true,
  },
  { label: "Team", href: "/landlord/team", icon: Users, disabled: true },
  {
    label: "Audit Log",
    href: "/landlord/audit-log",
    icon: ScrollText,
    disabled: true,
  },
  {
    label: "Settings",
    href: "/landlord/settings",
    icon: Settings,
    disabled: true,
  },
]

const MANAGER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/manager", icon: Home },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Tenants", href: "/tenants", icon: Users },
  { label: "Leases", href: "/leases", icon: ClipboardList },
  { label: "Payments", href: "/payments", icon: CreditCard },
  {
    label: "Maintenance",
    href: "/manager/maintenance",
    icon: Wrench,
    disabled: true,
  },
  { label: "Vendors", href: "/manager/vendors", icon: HardHat, disabled: true },
  {
    label: "Documents",
    href: "/manager/documents",
    icon: FileText,
    disabled: true,
  },
  {
    label: "Reports",
    href: "/manager/reports",
    icon: BarChart3,
    disabled: true,
  },
  {
    label: "Settings",
    href: "/manager/settings",
    icon: Settings,
    disabled: true,
  },
]

const TENANT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/tenant", icon: Home },
  {
    label: "My Lease",
    href: "/tenant/lease",
    icon: ClipboardList,
    disabled: true,
  },
  { label: "Payments", href: "/tenant/payments", icon: CreditCard },
  {
    label: "Maintenance",
    href: "/tenant/maintenance",
    icon: Wrench,
    disabled: true,
  },
  {
    label: "Documents",
    href: "/tenant/documents",
    icon: FileText,
    disabled: true,
  },
]

const VENDOR_NAV: NavItem[] = [
  { label: "Dashboard", href: "/vendor", icon: Home },
  {
    label: "My Tickets",
    href: "/vendor/tickets",
    icon: Ticket,
    disabled: true,
  },
  { label: "Profile", href: "/vendor/profile", icon: User, disabled: true },
]

export const NAVIGATION_MAP: Record<Role, NavItem[]> = {
  landlord: LANDLORD_NAV,
  manager: MANAGER_NAV,
  tenant: TENANT_NAV,
  vendor: VENDOR_NAV,
}
