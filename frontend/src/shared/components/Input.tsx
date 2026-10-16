import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...rest }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="mb-4">
        <label htmlFor={inputId} className="woof-label">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`woof-input ${error ? 'border-red-400 focus:ring-red-300' : ''} ${className}`}
          {...rest}
        />
        {error && <p className="woof-field-error">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
export default Input
