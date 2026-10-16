import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  sittingOfferService,
  Availability,
} from '../services/sittingOfferService'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'
import Alert from '../../../shared/components/Alert'

const DAYS = [
  'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday',
]

const DAY_LABELS: Record<string, string> = {
  Monday: 'Ponedeljak', Tuesday: 'Utorak', Wednesday: 'Sreda',
  Thursday: 'Četvrtak', Friday: 'Petak', Saturday: 'Subota', Sunday: 'Nedelja',
}

interface FormState {
  title: string
  description: string
  pricePerHour: string
  maxDogsCapacity: string
}

interface FormErrors {
  title?: string
  description?: string
  pricePerHour?: string
  maxDogsCapacity?: string
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!values.title.trim()) errors.title = 'Naziv je obavezan.'
  if (!values.description.trim()) errors.description = 'Opis je obavezan.'
  if (!values.pricePerHour || isNaN(Number(values.pricePerHour)) || Number(values.pricePerHour) < 1)
    errors.pricePerHour = 'Unesite validnu cenu.'
  if (!values.maxDogsCapacity || isNaN(Number(values.maxDogsCapacity)) || Number(values.maxDogsCapacity) < 1)
    errors.maxDogsCapacity = 'Unesite validan kapacitet.'
  return errors
}

const emptyAvailability = (day: string): Availability => ({
  dayOfWeek: day,
  fromTime: '08:00',
  toTime: '17:00',
  note: '',
})

export default function AddOfferPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    pricePerHour: '',
    maxDogsCapacity: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [availabilities, setAvailabilities] = useState<Record<string, Availability>>({})

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    setApiError(null)
  }

  function toggleDay(day: string) {
    if (selectedDays.includes(day)) {
      setSelectedDays((prev) => prev.filter((d) => d !== day))
      setAvailabilities((prev) => {
        const next = { ...prev }
        delete next[day]
        return next
      })
    } else {
      setSelectedDays((prev) => [...prev, day])
      setAvailabilities((prev) => ({
        ...prev,
        [day]: emptyAvailability(day),
      }))
    }
  }

  function updateAvailability(day: string, field: keyof Availability, value: string) {
    setAvailabilities((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      await sittingOfferService.create({
        title: form.title,
        description: form.description,
        pricePerHour: Number(form.pricePerHour),
        maxDogsCapacity: Number(form.maxDogsCapacity),
        weeklyAvailabilities: selectedDays.map((d) => availabilities[d]),
      })
      navigate('/dashboard/sitter/offers')
    } catch {
      setApiError('Greška pri kreiranju ponude. Pokušajte ponovo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/sitter/offers')}
          className="text-sm text-gray-400 hover:text-gray-600
                     transition-colors mb-3 flex items-center gap-1"
        >
          ← Nazad
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Nova ponuda</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Kreirajte ponudu čuvanja pasa
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100
                      border-t-4 border-t-woof-blue-600 shadow-card p-6">
        {apiError && <Alert type="error" message={apiError} />}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Naziv ponude *"
            placeholder="Čuvanje pasa u velikom dvorištu — Niš"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={errors.title}
          />

          <div className="mb-4">
            <label className="woof-label">
              Opis <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Opišite uslove čuvanja, vaše iskustvo..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`woof-input resize-none
                         ${errors.description
                           ? 'border-red-400 focus:ring-red-300'
                           : ''}`}
            />
            {errors.description && (
              <p className="woof-field-error">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cena po satu (RSD) *"
              type="number"
              min="1"
              placeholder="500"
              value={form.pricePerHour}
              onChange={(e) => handleChange('pricePerHour', e.target.value)}
              error={errors.pricePerHour}
            />
            <Input
              label="Maks. broj pasa *"
              type="number"
              min="1"
              placeholder="3"
              value={form.maxDogsCapacity}
              onChange={(e) => handleChange('maxDogsCapacity', e.target.value)}
              error={errors.maxDogsCapacity}
            />
          </div>

          {/* Dostupnost */}
          <div className="border-t border-gray-100 my-5" />
          <div className="mb-4">
            <p className="woof-label mb-2">Nedeljna dostupnost</p>
            <p className="text-xs text-gray-400 mb-3">
              Označite dane kada ste dostupni za čuvanje
            </p>

            {/* Selekcija dana */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`py-2 rounded-lg text-xs font-medium
                             transition-colors border
                             ${selectedDays.includes(day)
                               ? 'bg-woof-blue-600 text-white border-woof-blue-600'
                               : 'bg-white text-gray-500 border-gray-200 hover:border-woof-blue-300'
                             }`}
                >
                  {DAY_LABELS[day].slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Vreme po danu */}
            {selectedDays.length > 0 && (
              <div className="space-y-3">
                {selectedDays.map((day) => (
                  <div
                    key={day}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      {DAY_LABELS[day]}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="woof-label">Od</label>
                        <input
                          type="time"
                          value={availabilities[day]?.fromTime ?? '08:00'}
                          onChange={(e) =>
                            updateAvailability(day, 'fromTime', e.target.value)
                          }
                          className="woof-input text-sm"
                        />
                      </div>
                      <div>
                        <label className="woof-label">Do</label>
                        <input
                          type="time"
                          value={availabilities[day]?.toTime ?? '17:00'}
                          onChange={(e) =>
                            updateAvailability(day, 'toTime', e.target.value)
                          }
                          className="woof-input text-sm"
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Napomena (opciono)"
                      value={availabilities[day]?.note ?? ''}
                      onChange={(e) =>
                        updateAvailability(day, 'note', e.target.value)
                      }
                      className="woof-input text-xs"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 my-5" />

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" loading={loading}>
              Objavi ponudu
            </Button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/sitter/offers')}
              className="px-4 py-2.5 text-sm text-gray-500
                         hover:text-gray-700 transition-colors"
            >
              Otkaži
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}