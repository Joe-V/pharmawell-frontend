import { useId, type ComponentProps, type ReactNode } from 'react'

type InputProps = ComponentProps<'input'> & {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  leftPrefix?: string
  rightElement?: ReactNode
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  leftPrefix,
  rightElement,
  id,
  required,
  disabled,
  className,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  const wrapperClasses = [
    'flex items-center overflow-hidden rounded-lg border bg-card transition-colors',
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
          htmlFor={inputId}
          className="text-sm font-semibold text-foreground"
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      <div className={wrapperClasses}>
        {leftPrefix && (
          <span className="flex h-10.5 items-center border-r border-border bg-muted px-3 text-xs font-semibold text-muted-foreground select-none">
            {leftPrefix}
          </span>
        )}

        {leftIcon && (
          <span className="pl-3 text-muted-foreground flex items-center">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={[
            'h-10.5 w-full bg-transparent px-3 text-sm text-foreground',
            'placeholder:text-subtle-foreground focus:outline-none',
            'disabled:cursor-not-allowed disabled:text-disabled-foreground',
            leftIcon ? 'pl-2.5' : '',
            rightElement ? 'pr-2' : '',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />

        {rightElement && (
          <div className="pr-2.5 flex items-center text-muted-foreground">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-subtle-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}