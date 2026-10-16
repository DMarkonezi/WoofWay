import type { ChangeEvent } from 'react'
import Input from '../../../shared/components/Input'

export interface OwnerFields {
  firstName: string
  lastName: string
  phone: string
}

interface OwnerFormProps {
  values: OwnerFields
  errors: Partial<OwnerFields>
  onChange: (field: keyof OwnerFields, value: string) => void
}

export function validateOwner(v: OwnerFields): Partial<OwnerFields> {
  const e: Partial<OwnerFields> = {}
  if (!v.firstName.trim()) e.firstName = 'Ime je obavezno.'
  if (!v.lastName.trim()) e.lastName = 'Prezime je obavezno.'
  if (!v.phone.trim()) e.phone = 'Telefon je obavezan.'
  return e
}

export default function OwnerForm({ values, errors, onChange }: OwnerFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Ime"
          placeholder="Marko"
          value={values.firstName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('firstName', e.target.value)}
          error={errors.firstName}
        />
        <Input
          label="Prezime"
          placeholder="Petrović"
          value={values.lastName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('lastName', e.target.value)}
          error={errors.lastName}
        />
      </div>
      <Input
        label="Telefon"
        type="tel"
        placeholder="+381 60 123 4567"
        value={values.phone}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('phone', e.target.value)}
        error={errors.phone}
      />
    </>
  )
}
