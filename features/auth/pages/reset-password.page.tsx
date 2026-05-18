"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { ArrowLeft, CheckCircle2 } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { AUTH_ROUTES } from "@/shared/constants/routes.constants"

import { ResetPasswordForm } from "../components/reset-password-form.component"
import type { ResetPasswordFormValues } from "../schemas/reset-password.schema"
import { mockResetPassword } from "../services/auth-mock.service"

const ResetPasswordContent = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    setError(null)
    try {
      await mockResetPassword({ newPassword: values.newPassword, token })
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  if (isSuccess) {
    return (
      <div className="grid gap-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
        <div className="grid gap-1">
          <p className="font-medium">Password reset successful</p>
          <p className="text-sm text-muted-foreground">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={AUTH_ROUTES.LOGIN}>
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </Button>
      </div>
    )
  }

  return <ResetPasswordForm onSubmit={handleSubmit} error={error} />
}

export default function ResetPasswordPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </div>
      <Suspense>
        <ResetPasswordContent />
      </Suspense>
    </div>
  )
}
