interface AlertProps {
  type: 'success' | 'error' | 'info'
  message: string
}

const styles: Record<AlertProps['type'], string> = {
  success: 'bg-woof-green-50 border border-woof-green-200 text-woof-green-700',
  error:   'bg-red-50 border border-red-200 text-red-700',
  info:    'bg-woof-blue-50 border border-woof-blue-200 text-woof-blue-700',
}

export default function Alert({ type, message }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-lg px-4 py-3 text-sm mb-4 ${styles[type]}`}
    >
      {message}
    </div>
  )
}
