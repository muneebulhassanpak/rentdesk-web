"use client"

import { toast } from "sonner"

import { useAuth } from "@/shared/hooks/use-auth.hook"

import { LoginForm } from "../components/login-form.component"
import type { LoginFormValues } from "../schemas/login.schema"
import { authLogin } from "../services/auth.service"

export default function LoginPage() {
  const { login } = useAuth()

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await authLogin(values)
      login(response.user)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed")
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your RentDesk account
        </p>
      </div>
      <LoginForm onSubmit={handleSubmit} />
    </div>
  )
}
