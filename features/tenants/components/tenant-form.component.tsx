"use client"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

import {
  type EditTenantFormValues,
  editTenantSchema,
  type InviteTenantFormValues,
  inviteTenantSchema,
} from "../schemas/tenant.schema"

type InviteFormProps = {
  mode: "invite"
  defaultValues?: Partial<InviteTenantFormValues>
  onSubmit: (values: InviteTenantFormValues) => Promise<void>
  isSubmitting: boolean
}

type EditFormProps = {
  mode: "edit"
  defaultValues?: Partial<EditTenantFormValues>
  onSubmit: (values: EditTenantFormValues) => Promise<void>
  isSubmitting: boolean
}

type TenantFormProps = InviteFormProps | EditFormProps

export const TenantForm = ({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
}: TenantFormProps) => {
  if (mode === "invite") {
    return (
      <InviteForm
        defaultValues={defaultValues as Partial<InviteTenantFormValues>}
        onSubmit={onSubmit as (values: InviteTenantFormValues) => Promise<void>}
        isSubmitting={isSubmitting}
      />
    )
  }

  return (
    <EditForm
      defaultValues={defaultValues as Partial<EditTenantFormValues>}
      onSubmit={onSubmit as (values: EditTenantFormValues) => Promise<void>}
      isSubmitting={isSubmitting}
    />
  )
}

const InviteForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues?: Partial<InviteTenantFormValues>
  onSubmit: (values: InviteTenantFormValues) => Promise<void>
  isSubmitting: boolean
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteTenantFormValues>({
    resolver: zodResolver(inviteTenantSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tenant@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Jane Smith"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="phone">
            Phone <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            {...register("phone")}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          Send Invitation
        </Button>
      </div>
    </form>
  )
}

const EditForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues?: Partial<EditTenantFormValues>
  onSubmit: (values: EditTenantFormValues) => Promise<void>
  isSubmitting: boolean
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditTenantFormValues>({
    resolver: zodResolver(editTenantSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Jane Smith"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">
            Phone <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            {...register("phone")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="emergencyContactName">
            Emergency Contact Name{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="emergencyContactName"
            placeholder="Robert Smith"
            {...register("emergencyContactName")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="emergencyContactPhone">
            Emergency Contact Phone{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="emergencyContactPhone"
            type="tel"
            placeholder="(555) 987-6543"
            {...register("emergencyContactPhone")}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
