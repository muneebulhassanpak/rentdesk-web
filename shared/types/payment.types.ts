export const PAYMENT_STATUSES = {
  SCHEDULED: "scheduled",
  DUE: "due",
  PAID: "paid",
  LATE: "late",
  PARTIAL: "partial",
  OVERPAID: "overpaid",
  WAIVED: "waived",
} as const

export type PaymentStatus =
  (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES]

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  scheduled: "Scheduled",
  due: "Due",
  paid: "Paid",
  late: "Late",
  partial: "Partial",
  overpaid: "Overpaid",
  waived: "Waived",
}

export const PAYMENT_METHODS = {
  CASH: "cash",
  BANK_TRANSFER: "bank_transfer",
  CHECK: "check",
  STRIPE: "stripe",
  OTHER: "other",
} as const

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS]

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  check: "Check",
  stripe: "Stripe",
  other: "Other",
}

export type Payment = {
  id: string
  orgId: string
  leaseId: string
  unitId: string
  propertyId: string
  tenantId: string
  tenantName: string
  propertyName: string
  unitLabel: string
  dueDate: string
  amountDue: number
  amountPaid: number
  lateFee: number
  lateFeeAppliedAt?: string
  status: PaymentStatus
  paidAt?: string
  method?: PaymentMethod
  reference?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type PaymentDetail = Payment & {
  leaseStartDate: string
  leaseEndDate: string
  monthlyRent: number
  securityDeposit: number
}

export type RecordPaymentRequest = {
  amount: number
  method: PaymentMethod
  reference?: string
  date: string
  notes?: string
}

export type CollectionSummary = {
  totalExpected: number
  totalCollected: number
  outstanding: number
  lateCount: number
  collectionRate: number
}

export type RentRollItem = {
  unitId: string
  unitLabel: string
  tenantId?: string
  tenantName?: string
  monthlyRent: number
  amountDue: number
  amountPaid: number
  status: PaymentStatus
  paymentId?: string
}

export type RentRoll = {
  propertyId: string
  propertyName: string
  month: string
  items: RentRollItem[]
  totalExpected: number
  totalCollected: number
  collectionRate: number
}
