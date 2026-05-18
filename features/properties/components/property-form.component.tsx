"use client"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import type { PropertyType } from "@/shared/types/property.types"
import { PROPERTY_TYPE_LABELS } from "@/shared/types/property.types"

import {
  type PropertyFormValues,
  propertySchema,
} from "../schemas/property.schema"

type PropertyFormProps = {
  defaultValues?: Partial<PropertyFormValues>
  onSubmit: (values: PropertyFormValues) => Promise<void>
  error?: string | null
  submitLabel?: string
}

export const PropertyForm = ({
  defaultValues,
  onSubmit,
  error,
  submitLabel = "Save Property",
}: PropertyFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      type: "single_family",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
      },
      notes: "",
      ...defaultValues,
    },
  })

  const selectedType = watch("type")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Property Name</Label>
          <Input
            id="name"
            placeholder="e.g. 12 Maple Street"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={selectedType}
            onValueChange={(val) =>
              setValue("type", val as PropertyType, { shouldValidate: true })
            }
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>
      </div>

      <fieldset className="grid gap-4">
        <legend className="text-sm font-medium">Address</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="address.line1">Street Address</Label>
            <Input
              id="address.line1"
              placeholder="123 Main St"
              {...register("address.line1")}
            />
            {errors.address?.line1 && (
              <p className="text-sm text-destructive">
                {errors.address.line1.message}
              </p>
            )}
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="address.line2">
              Apt / Suite / Unit{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="address.line2"
              placeholder="Apt 4B"
              {...register("address.line2")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address.city">City</Label>
            <Input
              id="address.city"
              placeholder="Springfield"
              {...register("address.city")}
            />
            {errors.address?.city && (
              <p className="text-sm text-destructive">
                {errors.address.city.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address.state">
              State <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="address.state"
              placeholder="IL"
              {...register("address.state")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address.postalCode">
              Postal Code{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="address.postalCode"
              placeholder="62704"
              {...register("address.postalCode")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address.country">Country</Label>
            <Input
              id="address.country"
              placeholder="US"
              {...register("address.country")}
            />
            {errors.address?.country && (
              <p className="text-sm text-destructive">
                {errors.address.country.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="yearBuilt">
            Year Built <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="yearBuilt"
            type="number"
            placeholder="2005"
            {...register("yearBuilt", { valueAsNumber: true })}
          />
          {errors.yearBuilt && (
            <p className="text-sm text-destructive">
              {errors.yearBuilt.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">
          Notes <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Any additional notes about this property..."
          rows={3}
          {...register("notes")}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
