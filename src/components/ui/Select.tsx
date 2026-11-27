import { useId, type ComponentProps, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export type SelectOption = {
  label: string
  value: string | number
  disabled?: boolean
}

type SelectProps = ComponentProps<'select'> & {
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  options?: SelectOption[]
  leftIcon?: ReactNode
}

export function Select({
  label,
  error,
  helperText,
  placeholder,
  options = [],
  leftIcon,
  id,
  required,
  disabled,
  className,
  children,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  const wrapperClasses = [
    'relative flex items-center rounded-lg border bg-card transition-colors',
    'focus-within:ring-3',
    error
      ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20'
      : 'border-input focus-within:border-ring focus-within:ring-focus-halo',
    disabled ? 'bg-disabled text-disabled-foreground cursor-not-allowed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-semibold text-foreground"
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      <div className={wrapperClasses}>
        {leftIcon && (
          <span className="pointer-events-none pl-3 text-muted-foreground flex items-center">
            {leftIcon}
          </span>
        )}

        <select
          id={selectId}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={[
            'h-10.5 w-full appearance-none bg-transparent pr-9 text-sm text-foreground focus:outline-none',
            'disabled:cursor-not-allowed disabled:text-disabled-foreground',
            leftIcon ? 'pl-2.5' : 'pl-3',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
          {children}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
      </div>

      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-subtle-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}