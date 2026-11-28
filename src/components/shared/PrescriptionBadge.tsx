import { Check, Pill, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cx } from './cx'

export type PrescriptionBadgeVariant = 'product' | 'category'

export type PrescriptionBadgeProps = {
  requiresPrescription: boolean
  variant?: PrescriptionBadgeVariant
  className?: string
}

type BadgeTone = {
  label: string
  className: string
  icon: LucideIcon
}

function resolveTone(requiresPrescription: boolean, variant: PrescriptionBadgeVariant): BadgeTone {
  if (variant === 'category') {
    return requiresPrescription
      ? { label: 'Yes', className: 'bg-success-soft text-success', icon: Check }
      : { label: 'No', className: 'bg-destructive-soft text-destructive', icon: X }
  }

  return requiresPrescription
    ? { label: 'Rx Required', className: 'bg-prescription-bg text-prescription', icon: Pill }
    : { label: 'OTC', className: 'bg-otc-bg text-otc', icon: Check }
}

export function PrescriptionBadge({
  requiresPrescription,
  variant = 'product',
  className,
}: PrescriptionBadgeProps) {
  const tone = resolveTone(requiresPrescription, variant)
  const Icon = tone.icon

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        tone.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {tone.label}
    </span>
  )
}
