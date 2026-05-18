"use client"

import { ClipboardList, CreditCard, Wrench } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { useAuth } from "@/shared/hooks/use-auth.hook"

export default function TenantDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {user?.fullName?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">Your rental at a glance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Unit</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-1">
            <p className="text-sm text-muted-foreground">Unit</p>
            <p className="font-medium">4B, 12 Maple St</p>
          </div>
          <div className="grid gap-1">
            <p className="text-sm text-muted-foreground">Lease ends</p>
            <p className="font-medium">Mar 31, 2027</p>
          </div>
          <div className="grid gap-1">
            <p className="text-sm text-muted-foreground">Next rent due</p>
            <div className="flex items-center gap-2">
              <p className="font-medium">$1,800 on Jun 1</p>
              <Button size="sm">Pay now</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lease Status</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Active</div>
            <p className="text-xs text-muted-foreground">10 months remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Payment History
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,400</div>
            <p className="text-xs text-muted-foreground">3 payments made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">open ticket</p>
          </CardContent>
        </Card>
      </div>

      <Button variant="outline" className="justify-self-start">
        <Wrench className="h-4 w-4" />
        Report an issue
      </Button>
    </div>
  )
}
