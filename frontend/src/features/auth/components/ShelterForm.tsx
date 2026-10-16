import type { ChangeEvent } from 'react'
import Input from '../../../shared/components/Input'

export interface ShelterFields {
  shelterName: string
  address: string
  phone: string
  registrationNumber: string
}

interface ShelterFormProps {
  values: ShelterFields
  errors: Partial<ShelterFields>
  onChange: (field: keyof ShelterFields, value: string) => void
}

export function validateShelter(v: ShelterFields): Partial<ShelterFields> {
  const e: Partial<ShelterFields> = {}
  if (!v.shelterName.trim()) e.shelterName = 'Naziv azila je obavezan.'
  if (!v.address.trim()) e.address = 'Adresa je obavezna.'
  if (!v.phone.trim()) e.phone = 'Telefon je obavezan.'
  if (!v.registrationNumber.trim()) e.registrationNumber = 'Broj registracije je obavezan.'
  return e
}

export default function ShelterForm({ values, errors, onChange }: ShelterFormProps) {
  return (
    <>
      <Input
        label="Naziv azila"
        placeholder="Azil Srce"
        value={values.shelterName}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('shelterName', e.target.value)}
        error={errors.shelterName}
      />
      <Input
        label="Adresa"
        placeholder="Ul. Psa Sretnog 12, Beograd"
        value={values.address}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('address', e.target.value)}
        error={errors.address}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Broj registracije"
          placeholder="REG-12345"
          value={values.registrationNumber}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('registrationNumber', e.target.value)}
          error={errors.registrationNumber}
        />
        <Input
          label="Telefon"
          type="tel"
          placeholder="+381 11 123 4567"
          value={values.phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('phone', e.target.value)}
          error={errors.phone}
        />
      </div>
      <div className="mt-1 mb-4 rounded-lg bg-woof-blue-50 border border-woof-blue-100 px-4 py-3">
        <p className="text-xs text-woof-blue-700 leading-relaxed">
          <strong>Napomena:</strong> Nalog azila prolazi kroz verifikaciju moderatora.
        </p>
      </div>
    </>
  )
}