import { Building2, ChevronDown } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">RentDesk</span>
        </div>
        <Card className="shadow-sm">
          <CardHeader className="sr-only" />
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
        <Collapsible className="mt-3 rounded-md border border-border">
          <CollapsibleTrigger className="group flex w-full items-center justify-between px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
            <span className="font-medium">Demo credentials</span>
            <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <table className="w-full border-t border-border text-xs text-muted-foreground">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-1.5 text-left font-medium">Role</th>
                  <th className="px-3 py-1.5 text-left font-medium">Email</th>
                  <th className="px-3 py-1.5 text-left font-medium">
                    Password
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="border-b border-border">
                  <td className="px-3 py-1.5">Landlord</td>
                  <td className="px-3 py-1.5">landlord@oaktree.demo</td>
                  <td className="px-3 py-1.5">demo1234</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1.5">Manager</td>
                  <td className="px-3 py-1.5">manager@oaktree.demo</td>
                  <td className="px-3 py-1.5">demo1234</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1.5">Tenant</td>
                  <td className="px-3 py-1.5">tenant1@oaktree.demo</td>
                  <td className="px-3 py-1.5">demo1234</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5">Vendor</td>
                  <td className="px-3 py-1.5">vendor@reliable.demo</td>
                  <td className="px-3 py-1.5">demo1234</td>
                </tr>
              </tbody>
            </table>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
