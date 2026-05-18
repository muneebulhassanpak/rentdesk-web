import type { Metadata } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"

import { Providers } from "@/shared/components/providers.component"
import { Toaster } from "@/shared/components/ui/sonner"
import { cn } from "@/shared/lib/utils"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "RentDesk",
    template: "%s | RentDesk",
  },
  description: "Property management for small landlords",
}

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geist.variable,
        geistMono.variable,
        instrumentSerif.variable,
        "font-sans"
      )}
    >
      <body>
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  )
}
