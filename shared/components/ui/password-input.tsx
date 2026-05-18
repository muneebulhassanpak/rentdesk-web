"use client"

import * as React from "react"

import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/shared/lib/utils"

function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [isVisible, setIsVisible] = React.useState(false)

  const handleToggle = () => {
    setIsVisible((prev) => !prev)
  }

  return (
    <div className="relative">
      <input
        type={isVisible ? "text" : "password"}
        data-slot="input"
        className={cn(
          "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 pr-9 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={handleToggle}
        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground hover:text-foreground"
        aria-label={isVisible ? "Hide password" : "Show password"}
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}

export { PasswordInput }
