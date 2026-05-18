"use client"

import { useState } from "react"
import Link from "next/link"

import { ArrowLeft, Mail } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { AUTH_ROUTES } from "@/shared/constants/routes.constants"

import { ForgotPasswordForm } from "../components/forgot-password-form.component"
import type { ForgotPasswordFormValues } from "../schemas/forgot-password.schema"
import { mockForgotPassword } from "../services/auth-mock.service"

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setError(null)
    try {
      await mockForgotPassword(values)
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  if (isSuccess) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div className="grid gap-1">
            <p className="font-medium">Check your email</p>
            <p className="text-sm text-muted-foreground">
              If an account exists with that email, we&apos;ve sent a password
              reset link.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={AUTH_ROUTES.LOGIN}>
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>
      <ForgotPasswordForm onSubmit={handleSubmit} error={error} />
    </div>
  )
}
