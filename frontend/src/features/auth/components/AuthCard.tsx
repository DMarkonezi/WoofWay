import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

/**
 * Centered card with blue top border.
 * Used as the container for Login and Register forms.
 */
export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo area */}
      <div className="mb-6 text-center">
        <span className="text-2xl font-semibold text-woof-blue-600 tracking-tight">
          WoofWay
        </span>
        <span className="ml-1 text-2xl">🐾</span>
      </div>

      {/* Card */}
      <div className="woof-card w-full max-w-md px-8 py-8">
        <h1 className="text-lg font-semibold text-gray-800 mb-1">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  )
}
