import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Input from '../../../shared/components/Input'
import Select from '../../../shared/components/Select'
import Button from '../../../shared/components/Button'
import Alert from '../../../shared/components/Alert'
import OwnerForm, { type OwnerFields, validateOwner } from '../components/OwnerForm'
import SitterForm, { type SitterFields, validateSitter } from '../components/SitterForm'
import ShelterForm, { type ShelterFields, validateShelter } from '../components/ShelterForm'
import { authService, type UserRole } from '../services/authService'

interface Credentials {
  email: string
  password: string
  confirmPassword: string
}

const initialCredentials: Credentials = {
  email: '',
  password: '',
  confirmPassword: '',
}

const initialOwner: OwnerFields = { firstName: '', lastName: '', phone: '' }
const initialSitter: SitterFields = {
  firstName: '',
  lastName: '',
  phone: '',
  city: '',
  bio: '',
}
const initialShelter: ShelterFields = {
  shelterName: '',
  address: '',
  phone: '',
  registrationNumber: '',
}

const ROLE_OPTIONS = [
  { value: 'Owner',   label: 'Vlasnik (Owner)' },
  { value: 'Sitter',  label: 'Čuvar (Sitter)' },
  { value: 'Shelter', label: 'Azil (Shelter)' },
]

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>('Owner')
  const [creds, setCreds] = useState<Credentials>(initialCredentials)
  const [credsErrors, setCredsErrors] = useState<Partial<Credentials>>({})

  const [ownerFields, setOwnerFields] = useState<OwnerFields>(initialOwner)
  const [ownerErrors, setOwnerErrors] = useState<Partial<OwnerFields>>({})

  const [sitterFields, setSitterFields] = useState<SitterFields>(initialSitter)
  const [sitterErrors, setSitterErrors] = useState<Partial<SitterFields>>({})

  const [shelterFields, setShelterFields] = useState<ShelterFields>(initialShelter)
  const [shelterErrors, setShelterErrors] = useState<Partial<ShelterFields>>({})

  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function handleCredsChange(field: keyof Credentials, value: string) {
    setCreds((p) => ({ ...p, [field]: value }))
    if (credsErrors[field]) setCredsErrors((p) => ({ ...p, [field]: undefined }))
    setApiError(null)
  }

  function validateCredentials(): Partial<Credentials> {
    const e: Partial<Credentials> = {}
    if (!creds.email.trim()) {
      e.email = 'Email je obavezan.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creds.email)) {
      e.email = 'Unesite ispravnu email adresu.'
    }
    if (!creds.password) {
      e.password = 'Lozinka je obavezna.'
    } else if (creds.password.length < 8) {
      e.password = 'Lozinka mora imati najmanje 8 karaktera.'
    }
    if (!creds.confirmPassword) {
      e.confirmPassword = 'Potvrdite lozinku.'
    } else if (creds.password !== creds.confirmPassword) {
      e.confirmPassword = 'Lozinke se ne poklapaju.'
    }
    return e
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setApiError(null)
    setSuccessMessage(null)

    const credErrs = validateCredentials()
    setCredsErrors(credErrs)

    let roleValid = true

    if (role === 'Owner') {
      const errs = validateOwner(ownerFields)
      setOwnerErrors(errs)
      if (Object.keys(errs).length > 0) roleValid = false
    } else if (role === 'Sitter') {
      const errs = validateSitter(sitterFields)
      setSitterErrors(errs)
      if (Object.keys(errs).length > 0) roleValid = false
    } else {
      const errs = validateShelter(shelterFields)
      setShelterErrors(errs)
      if (Object.keys(errs).length > 0) roleValid = false
    }

    if (Object.keys(credErrs).length > 0 || !roleValid) return

    setLoading(true)
    try {
      
      let payload: any = { 
        email: creds.email, 
        password: creds.password, 
        role 
      }

      if (role === 'Owner') {
        payload = { 
          ...payload,
          firstName: 'Shelter', 
          lastName: ownerFields.lastName, 
          phoneNumber: ownerFields.phone,
          city: 'Nepoznato' 
        }
      } else if (role === 'Sitter') {
        payload = { 
          ...payload, 
          firstName: sitterFields.firstName, 
          lastName: sitterFields.lastName, 
          phoneNumber: sitterFields.phone,
          city: sitterFields.city
        }
      } else if (role === 'Shelter') {
        payload = { 
          ...payload,
          firstName: shelterFields.shelterName, 
          lastName: shelterFields.shelterName,  
          city: 'Unknown',

          shelterName: shelterFields.shelterName,
          address: shelterFields.address,
          phoneNumber: shelterFields.phone,
          registrationNumber: shelterFields.registrationNumber 
        }
      }

      await authService.register(payload)

      if (role === 'Shelter') {
        setSuccessMessage('Vaš nalog je kreiran i čeka odobrenje moderatora.')
      } else {
        setSuccessMessage('Registracija uspešna!')
      }
    } catch (err: any) {
      setApiError(err?.response?.data?.message ?? 'Greška pri registraciji.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Kreirajte nalog"
      subtitle="Pridružite se WoofWay zajednici."
    >
      {successMessage && <Alert type="success" message={successMessage} />}
      {apiError && <Alert type="error" message={apiError} />}

      {!successMessage && (
        <form onSubmit={handleSubmit} noValidate>
          {/* Role selector */}
          <Select
            label="Tip naloga"
            options={ROLE_OPTIONS}
            value={role}
            onChange={(e) => {
              setRole(e.target.value as UserRole)
              setApiError(null)
            }}
          />

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Role-specific fields */}
          {role === 'Owner' && (
            <OwnerForm
              values={ownerFields}
              errors={ownerErrors}
              onChange={(f, v) => {
                setOwnerFields((p) => ({ ...p, [f]: v }))
                setOwnerErrors((p) => ({ ...p, [f]: undefined }))
              }}
            />
          )}
          {role === 'Sitter' && (
            <SitterForm
              values={sitterFields}
              errors={sitterErrors}
              onChange={(f, v) => {
                setSitterFields((p) => ({ ...p, [f]: v }))
                setSitterErrors((p) => ({ ...p, [f]: undefined }))
              }}
            />
          )}
          {role === 'Shelter' && (
            <ShelterForm
              values={shelterFields}
              errors={shelterErrors}
              onChange={(f, v) => {
                setShelterFields((p) => ({ ...p, [f]: v }))
                setShelterErrors((p) => ({ ...p, [f]: undefined }))
              }}
            />
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Credentials */}
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="vas@email.com"
            value={creds.email}
            onChange={(e) => handleCredsChange('email', e.target.value)}
            error={credsErrors.email}
          />
          <Input
            label="Lozinka"
            type="password"
            autoComplete="new-password"
            placeholder="Minimum 8 karaktera"
            value={creds.password}
            onChange={(e) => handleCredsChange('password', e.target.value)}
            error={credsErrors.password}
          />
          <Input
            label="Potvrda lozinke"
            type="password"
            autoComplete="new-password"
            placeholder="Ponovite lozinku"
            value={creds.confirmPassword}
            onChange={(e) => handleCredsChange('confirmPassword', e.target.value)}
            error={credsErrors.confirmPassword}
          />

          <div className="mt-6">
            <Button
              type="submit"
              variant={role === 'Shelter' ? 'outline' : 'primary'}
              loading={loading}
            >
              {role === 'Shelter' ? 'Pošalji zahtev za verifikaciju' : 'Registruj se'}
            </Button>
          </div>
        </form>
      )}

      {/* Link */}
      <p className="mt-5 text-center text-sm text-gray-500">
        Već imate nalog?{' '}
        <Link
          to="/login"
          className="text-woof-blue-600 font-medium hover:underline"
        >
          Prijavite se
        </Link>
      </p>
    </AuthCard>
  )
}
