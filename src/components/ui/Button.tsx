import type { ComponentProps, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-xs',
  secondary:
    'border border-border bg-card text-foreground hover:bg-muted',
  outline:
    'border border-primary/40 bg-card text-primary hover:bg-primary-soft',
  ghost:
    'bg-transparent text-primary hover:bg-primary-soft',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive-hover shadow-xs',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-xs rounded-lg gap-1.5',
  md: 'h-10.5 px-4.5 text-sm rounded-lg gap-2',
  lg: 'h-12 px-6 text-sm rounded-xl gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center font-semibold transition-colors cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-halo',
    'disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground disabled:border-border',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classes}
      {...rest}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
}