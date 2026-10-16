import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
}

export default function Select({
  label,
  options,
  error,
  id,
  className = '',
  ...rest
}: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="mb-4">
      <label htmlFor={selectId} className="woof-label">
        {label}
      </label>
      <select
        id={selectId}
        className={`woof-input bg-white ${error ? 'border-red-400 focus:ring-red-300' : ''} ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="woof-field-error">{error}</p>}
    </div>
  )
}
