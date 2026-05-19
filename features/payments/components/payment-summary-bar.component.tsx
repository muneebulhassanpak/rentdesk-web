"use client"

import { AlertTriangle, DollarSign, TrendingUp } from "lucide-react"

import { StatCard } from "@/shared/components/stat-card.component"
import type { CollectionSummary } from "@/shared/types/payment.types"

import { formatCurrency } from "../utils/payment.utils"

type PaymentSummaryBarProps = {
  summary: CollectionSummary
}

export const PaymentSummaryBar = ({ summary }: PaymentSummaryBarProps) => {
  return (
    <div
      data-testid="payment-summary-bar"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <StatCard
        label="Expected This Month"
        value={formatCurrency(summary.totalExpected)}
        icon={DollarSign}
      />
      <StatCard
        label="Collected"
        value={formatCurrency(summary.totalCollected)}
        icon={DollarSign}
      />
      <StatCard
        label="Outstanding"
        value={formatCurrency(summary.outstanding)}
        icon={AlertTriangle}
      />
      <StatCard
        label="Collection Rate"
        value={`${summary.collectionRate}%`}
        icon={TrendingUp}
        trend={`${summary.lateCount} late`}
        trendUp={summary.lateCount === 0}
      />
    </div>
  )
}
