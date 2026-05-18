"use client"

import { Bell, LogOut, Settings, User } from "lucide-react"

import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Separator } from "@/shared/components/ui/separator"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { useAuth } from "@/shared/hooks/use-auth.hook"

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

export const Topbar = () => {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <header className="flex h-14 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]">
          3
        </Badge>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
