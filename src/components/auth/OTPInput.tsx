import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'

type OTPInputProps = {
  value: string
  onChange: (value: string) => void
  length?: number
  error?: string
  disabled?: boolean
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  error,
  disabled = false,
}: OTPInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length }, (_, index) => value[index] ?? '')

  const updateAt = (index: number, char: string) => {
    const next = [...digits]
    next[index] = char
    onChange(next.join(''))
  }

  const handleChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '')
    if (!cleaned) {
      updateAt(index, '')
      return
    }

    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, length)
      onChange(pasted)
      const targetIndex = Math.min(pasted.length, length - 1)
      inputsRef.current[targetIndex]?.focus()
      return
    }

    updateAt(index, cleaned)
    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        updateAt(index, '')
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus()
        updateAt(index - 1, '')
      }
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    onChange(pasted)
    const targetIndex = Math.min(pasted.length, length - 1)
    inputsRef.current[targetIndex]?.focus()
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            disabled={disabled}
            value={digit}
            aria-label={`Verification digit ${index + 1}`}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={[
              'h-12 w-10 sm:h-13 sm:w-12 rounded-xl border bg-card text-center text-lg font-bold text-foreground transition-colors',
              'focus:outline-none focus:ring-3',
              error
                ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                : 'border-input focus:border-ring focus:ring-focus-halo',
              disabled ? 'bg-disabled text-disabled-foreground cursor-not-allowed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </div>

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}