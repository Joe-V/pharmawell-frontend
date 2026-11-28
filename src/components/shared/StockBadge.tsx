import { AlertTriangle, Check, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cx } from './cx'
import { getStockLevel, type StockLevel } from './stockLevel'

export type StockBadgeProps = {
  quantity: number
  threshold: number
  showCount?: boolean
  className?: string
}

const toneClass: Record<StockLevel, string> = {
  'in-stock': 'bg-in-stock-bg text-in-stock',
  'low-stock': 'bg-low-stock-bg text-low-stock',
  'out-of-stock': 'bg-out-of-stock-bg text-out-of-stock',
}

const levelIcon: Record<StockLevel, LucideIcon> = {
  'in-stock': Check,
  'low-stock': AlertTriangle,
  'out-of-stock': X,
}

const levelLabel: Record<StockLevel, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
}

export function StockBadge({ quantity, threshold, showCount = false, className }: StockBadgeProps) {
  const level = getStockLevel(quantity, threshold)
  const Icon = levelIcon[level]
  const status = levelLabel[level]
  const label = showCount && level !== 'out-of-stock' ? `${quantity} ${status}` : status

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        toneClass[level],
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  )
}
