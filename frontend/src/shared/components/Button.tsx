import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'outline'
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'w-full py-2.5 px-4 text-sm font-medium rounded-lg transition-colors duration-150 ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants: Record<string, string> = {
    primary:
      'bg-woof-blue-600 hover:bg-woof-blue-700 text-white focus:ring-woof-blue-400',
    success:
      'bg-woof-green-600 hover:bg-woof-green-700 text-white focus:ring-woof-green-400',
    outline:
      'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-300',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Učitavanje…
        </span>
      ) : (
        children
      )}
    </button>
  )
}
