"use client"

import { useForm } from "react-hook-form"
import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { PasswordInput } from "@/shared/components/ui/password-input"
import { AUTH_ROUTES } from "@/shared/constants/routes.constants"

import { type LoginFormValues, loginSchema } from "../schemas/login.schema"

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => Promise<void>
  error?: string | null
}

export const LoginForm = ({ onSubmit, error }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="landlord@oaktree.demo"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href={AUTH_ROUTES.FORGOT_PASSWORD}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Sign in
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Tenant?{" "}
        <Link
          href={AUTH_ROUTES.MAGIC_LINK}
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign in with magic link
        </Link>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={AUTH_ROUTES.REGISTER}
          className="text-primary underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </div>
    </form>
  )
}
