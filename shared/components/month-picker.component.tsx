"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

type MonthPickerProps = {
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
}

export const MonthPicker = ({
  value,
  onValueChange,
  options,
  className,
}: MonthPickerProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
