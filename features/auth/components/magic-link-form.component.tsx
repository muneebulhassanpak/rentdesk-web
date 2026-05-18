"use client"

import { useForm } from "react-hook-form"
import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { AUTH_ROUTES } from "@/shared/constants/routes.constants"

import {
  type MagicLinkFormValues,
  magicLinkSchema,
} from "../schemas/magic-link.schema"

type MagicLinkFormProps = {
  onSubmit: (values: MagicLinkFormValues) => Promise<void>
  error?: string | null
}

export const MagicLinkForm = ({ onSubmit, error }: MagicLinkFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MagicLinkFormValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a link to sign in — no password
        needed.
      </p>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tenant@example.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Send magic link
      </Button>

      <div className="text-center">
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-3 w-3" />
          Sign in with password
        </Link>
      </div>
    </form>
  )
}
