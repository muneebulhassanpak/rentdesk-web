"use client"

import { useState } from "react"

import { useAuth } from "@/shared/hooks/use-auth.hook"

import { LoginForm } from "../components/login-form.component"
import type { LoginFormValues } from "../schemas/login.schema"
import { mockLogin } from "../services/auth-mock.service"

export default function LoginPage() {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: LoginFormValues) => {
    setError(null)
    try {
      const response = await mockLogin(values)
      login(response.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
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
      <LoginForm onSubmit={handleSubmit} error={error} />
    </div>
  )
}
