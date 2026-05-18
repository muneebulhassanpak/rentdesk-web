"use client"

import { useForm } from "react-hook-form"
import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { PasswordInput } from "@/shared/components/ui/password-input"
import { AUTH_ROUTES } from "@/shared/constants/routes.constants"

import {
  type RegisterFormValues,
  registerSchema,
} from "../schemas/register.schema"

type RegisterFormProps = {
  onSubmit: (values: RegisterFormValues) => Promise<void>
  error?: string | null
}

export const RegisterForm = ({ onSubmit, error }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      orgName: "",
      password: "",
      confirmPassword: "",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          placeholder="Jane Smith"
          autoComplete="name"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="orgName">Organization name</Label>
        <Input
          id="orgName"
          placeholder="My Properties LLC"
          {...register("orgName")}
        />
        {errors.orgName && (
          <p className="text-sm text-destructive">{errors.orgName.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Repeat your password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Create account
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  )
}
