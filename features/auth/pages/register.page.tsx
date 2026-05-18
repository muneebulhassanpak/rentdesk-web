"use client"

import { useState } from "react"

import { useAuth } from "@/shared/hooks/use-auth.hook"

import { RegisterForm } from "../components/register-form.component"
import type { RegisterFormValues } from "../schemas/register.schema"
import { mockRegister } from "../services/auth-mock.service"

export default function RegisterPage() {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: RegisterFormValues) => {
    setError(null)
    try {
      const response = await mockRegister(values)
      login(response.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start managing your rental properties with RentDesk
        </p>
      </div>
      <RegisterForm onSubmit={handleSubmit} error={error} />
    </div>
  )
}
