import type { ChangeEvent } from 'react'
import Input from '../../../shared/components/Input'

export interface SitterFields {
  firstName: string
  lastName: string
  phone: string
  city: string
  bio: string
}

interface SitterFormProps {
  values: SitterFields
  errors: Partial<SitterFields>
  onChange: (field: keyof SitterFields, value: string) => void
}

export function validateSitter(v: SitterFields): Partial<SitterFields> {
  const e: Partial<SitterFields> = {}
  if (!v.firstName.trim()) e.firstName = 'Ime je obavezno.'
  if (!v.lastName.trim()) e.lastName = 'Prezime je obavezno.'
  if (!v.phone.trim()) e.phone = 'Telefon je obavezan.'
  if (!v.city.trim()) e.city = 'Grad je obavezan.'
  if (!v.bio.trim()) e.bio = 'Kratak opis je obavezan.'
  return e
}

export default function SitterForm({ values, errors, onChange }: SitterFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Ime"
          placeholder="Ana"
          value={values.firstName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('firstName', e.target.value)}
          error={errors.firstName}
        />
        <Input
          label="Prezime"
          placeholder="Jovanović"
          value={values.lastName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('lastName', e.target.value)}
          error={errors.lastName}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Telefon"
          type="tel"
          placeholder="+381 60 123 4567"
          value={values.phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('phone', e.target.value)}
          error={errors.phone}
        />
        <Input
          label="Grad"
          placeholder="Beograd"
          value={values.city}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('city', e.target.value)}
          error={errors.city}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="bio" className="woof-label">Kratak opis</label>
        <textarea
          id="bio"
          rows={3}
          placeholder="Volim pse, imam iskustvo sa…"
          value={values.bio}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange('bio', e.target.value)}
          className={`woof-input resize-none ${errors.bio ? 'border-red-400 focus:ring-red-300' : ''}`}
        />
        {errors.bio && <p className="woof-field-error">{errors.bio}</p>}
      </div>
    </>
  )
}