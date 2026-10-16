import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  sittingOfferService,
  SittingOffer,
} from '../../sitter/services/sittingOfferService'
import {
  sittingRequestService,
} from '../../sitter/services/sittingRequestService'
import { dogService, Dog } from '../../dogs/services/dogService'
import { useSitterData } from '../hooks/useSitterData'

const DAY_LABELS: Record<string, string> = {
  Monday: 'Ponedeljak', Tuesday: 'Utorak', Wednesday: 'Sreda',
  Thursday: 'Četvrtak', Friday: 'Petak', Saturday: 'Subota', Sunday: 'Nedelja',
}

interface RequestForm {
  dogId: string
  startTime: string
  endTime: string
  note: string
}

interface RequestErrors {
  dogId?: string
  startTime?: string
  endTime?: string
}

function validateRequest(values: RequestForm): RequestErrors {
  const errors: RequestErrors = {}
  if (!values.dogId) errors.dogId = 'Izaberite psa.'
  if (!values.startTime) errors.startTime = 'Unesite datum i vreme početka.'
  if (!values.endTime) errors.endTime = 'Unesite datum i vreme završetka.'
  if (values.startTime && values.endTime && values.endTime <= values.startTime)
    errors.endTime = 'Vreme završetka mora biti posle početka.'
  return errors
}

export default function SitterProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [modalOpen, setModalOpen] = useState(false)
  const [requestForm, setRequestForm] = useState<RequestForm>({
    dogId: '',
    startTime: '',
    endTime: '',
    note: '',
  })
  const [requestErrors, setRequestErrors] = useState<RequestErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const { offer, myDogs, loading, error } = useSitterData(id);

  function handleFormChange(field: keyof RequestForm, value: string) {
    setRequestForm((prev) => ({ ...prev, [field]: value }))
    if (requestErrors[field as keyof RequestErrors]) {
      setRequestErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    setApiError(null)
  }

  async function handleSubmitRequest() {
    const errors = validateRequest(requestForm)
    if (Object.keys(errors).length > 0) {
      setRequestErrors(errors)
      return
    }

    if (!offer) return
    setSubmitting(true)
    try {
      await sittingRequestService.create({
        sittingOfferId: offer.id,
        dogId: requestForm.dogId,
        startTime: new Date(requestForm.startTime).toISOString(),
        endTime: new Date(requestForm.endTime).toISOString(),
        note: requestForm.note || undefined,
      })
      setModalOpen(false)
      setRequestSent(true)
    } catch {
      setApiError('Greška pri slanju zahteva. Pokušajte ponovo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="h-40 bg-white rounded-xl border border-gray-100 animate-pulse" />
        <div className="h-32 bg-white rounded-xl border border-gray-100 animate-pulse" />
      </div>
    )
  }

  if (error || !offer) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-3">🏠</p>
        <p className="text-sm">{error ?? 'Ponuda nije pronađena.'}</p>
        <button
          onClick={() => navigate('/dashboard/owner/sitters')}
          className="mt-3 text-xs text-woof-blue-600 hover:underline"
        >
          ← Nazad na čuvare
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      {/* Nazad */}
      <button
        onClick={() => navigate('/dashboard/owner/sitters')}
        className="text-sm text-gray-400 hover:text-gray-600
                   transition-colors mb-4 flex items-center gap-1"
      >
        ← Nazad
      </button>

      {/* Info kartica */}
      <div className="bg-white rounded-xl border border-gray-100
                      border-t-4 border-t-woof-blue-600 shadow-card p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-woof-blue-100
                          flex items-center justify-center text-2xl shrink-0">
            🐾
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {offer.title}
            </h1>
            <p className="text-sm text-gray-400">📍 {offer.city}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mt-4">
          {offer.description}
        </p>
      </div>

      {/* Detalji */}
      <div className="bg-white rounded-xl border border-gray-100
                      shadow-card p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Detalji ponude
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold text-woof-blue-600">
              {offer.pricePerHour.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">RSD po satu</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold text-woof-blue-600">
              {offer.maxDogsCapacity}
            </p>
            <p className="text-xs text-gray-400 mt-1">Maks. pasa</p>
          </div>
        </div>

        {/* Dostupnost */}
        {offer.weeklyAvailabilities.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Dostupnost
            </h2>
            <div className="space-y-2">
              {offer.weeklyAvailabilities.map((a) => (
                <div
                  key={a.dayOfWeek}
                  className="flex items-center justify-between
                             bg-gray-50 rounded-lg px-3 py-2"
                >
                  <span className="text-xs font-medium text-gray-700">
                    {DAY_LABELS[a.dayOfWeek] ?? a.dayOfWeek}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {a.fromTime} — {a.toTime}
                    </span>
                    {a.note && (
                      <span className="text-xs text-gray-400 italic">
                        ({a.note})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Zahtev */}
      <div className="bg-white rounded-xl border border-gray-100
                      shadow-card p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">
          Pošalji zahtev
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Zahtev ide čuvaru na odobrenje. Nakon odobrenja možete se
          dogovoriti putem chata.
        </p>

        {requestSent ? (
          <div className="rounded-lg bg-woof-green-50 border
                          border-woof-green-100 px-4 py-3">
            <p className="text-sm text-woof-green-700 font-medium">
              ✓ Zahtev je uspešno poslat! Čekajte odgovor čuvara.
            </p>
          </div>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-2.5 px-4 bg-woof-blue-600 hover:bg-woof-blue-700
                       text-white text-sm font-medium rounded-lg transition-colors"
          >
            Pošalji zahtev za čuvanje
          </button>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal sadržaj */}
          <div className="relative bg-white rounded-xl shadow-xl
                          w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900">
                Zahtev za čuvanje
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {apiError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100
                              px-4 py-3">
                <p className="text-xs text-red-600">{apiError}</p>
              </div>
            )}

            {/* Izbor psa */}
            <div className="mb-4">
              <label className="woof-label">
                Izaberite psa <span className="text-red-400">*</span>
              </label>
              {myDogs.length === 0 ? (
                <div className="rounded-lg bg-yellow-50 border border-yellow-100
                                px-4 py-3">
                  <p className="text-xs text-yellow-700">
                    Nemate registrovanih pasa.{' '}
                    <button
                      onClick={() => navigate('/dashboard/owner/my-dogs/new')}
                      className="underline font-medium"
                    >
                      Dodajte psa
                    </button>
                    {' '}pre slanja zahteva.
                  </p>
                </div>
              ) : (
                <select
                  value={requestForm.dogId}
                  onChange={(e) => handleFormChange('dogId', e.target.value)}
                  className={`woof-input bg-white
                             ${requestErrors.dogId
                               ? 'border-red-400 focus:ring-red-300'
                               : ''}`}
                >
                  <option value="">— Izaberite psa —</option>
                  {myDogs.map((dog) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.name || 'Nepoznato ime'} ({dog.breed || 'Nepoznata rasa'})
                    </option>
                  ))}
                </select>
              )}
              {requestErrors.dogId && (
                <p className="woof-field-error">{requestErrors.dogId}</p>
              )}
            </div>

            {/* Datum i vreme od */}
            <div className="mb-4">
              <label className="woof-label">
                Od <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                value={requestForm.startTime}
                onChange={(e) => handleFormChange('startTime', e.target.value)}
                className={`woof-input
                           ${requestErrors.startTime
                             ? 'border-red-400 focus:ring-red-300'
                             : ''}`}
              />
              {requestErrors.startTime && (
                <p className="woof-field-error">{requestErrors.startTime}</p>
              )}
            </div>

            {/* Datum i vreme do */}
            <div className="mb-4">
              <label className="woof-label">
                Do <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                value={requestForm.endTime}
                onChange={(e) => handleFormChange('endTime', e.target.value)}
                className={`woof-input
                           ${requestErrors.endTime
                             ? 'border-red-400 focus:ring-red-300'
                             : ''}`}
              />
              {requestErrors.endTime && (
                <p className="woof-field-error">{requestErrors.endTime}</p>
              )}
            </div>

            {/* Napomena */}
            <div className="mb-5">
              <label className="woof-label">Napomena (opciono)</label>
              <textarea
                rows={2}
                placeholder="npr. Pas pije lekove u 12h..."
                value={requestForm.note}
                onChange={(e) => handleFormChange('note', e.target.value)}
                className="woof-input resize-none"
              />
            </div>

            {/* Procena cene */}
            {requestForm.startTime && requestForm.endTime &&
             requestForm.endTime > requestForm.startTime && (
              <div className="mb-5 bg-woof-blue-50 border border-woof-blue-100
                              rounded-lg px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-woof-blue-700">
                    Procenjena cena
                  </span>
                  <span className="text-sm font-semibold text-woof-blue-700">
                    {(
                      ((new Date(requestForm.endTime).getTime() -
                        new Date(requestForm.startTime).getTime()) /
                        3600000) *
                      offer.pricePerHour
                    ).toFixed(2)}{' '}
                    RSD
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmitRequest}
                disabled={submitting || myDogs.length === 0}
                className="flex-1 py-2.5 bg-woof-blue-600 hover:bg-woof-blue-700
                           text-white text-sm font-medium rounded-lg
                           transition-colors disabled:opacity-60
                           disabled:cursor-not-allowed"
              >
                {submitting ? 'Slanje...' : 'Pošalji zahtev'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 text-sm text-gray-500
                           hover:text-gray-700 transition-colors"
              >
                Otkaži
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}