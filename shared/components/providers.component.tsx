"use client"

import { useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { ThemeProvider } from "@/shared/components/theme-provider"
import { AuthProvider } from "@/shared/contexts/auth.context"

const STALE_TIME_MS = 60_000

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME_MS,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}
