import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'
import Alert from '../../../shared/components/Alert'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'

interface FormState {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const ROLE_REDIRECT = {
  Owner:   '/dashboard/owner/my-dogs',
  Sitter:  '/dashboard/sitter/offers',
  Shelter: '/dashboard/shelter/dogs',
  Admin:   '/admin/shelters',
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!values.email.trim()) {
    errors.email = 'Email je obavezan.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Unesite ispravnu email adresu.'
  }
  if (!values.password) {
    errors.password = 'Lozinka je obavezna.'
  }
  return errors
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState<FormState>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    setApiError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setApiError(null)

    try {
      
      const result = await authService.login({
        email: form.email,
        password: form.password,
      })

      authService.saveToken(result.data.token)

      const me = await authService.me()

      login(result.data.token, me)

      navigate(ROLE_REDIRECT[me.role])

    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Pogrešan email ili lozinka.'
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Dobrodošli nazad"
      subtitle="Prijavite se na vaš WoofWay nalog."
    >
      {apiError && <Alert type="error" message={apiError} />}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="vas@email.com"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />

        <Input
          label="Lozinka"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
        />

        <div className="mt-6">
          <Button type="submit" variant="primary" loading={loading}>
            Prijavi se
          </Button>
        </div>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Nemate nalog?{' '}
        <Link
          to="/register"
          className="text-woof-blue-600 font-medium hover:underline"
        >
          Registrujte se
        </Link>
      </p>
    </AuthCard>
  )
}