import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { shelterService } from '../../shelters/services/shelterService'
import { DogStatus } from '../../dogs/services/dogService'
import { DOG_STATUS_COLORS, DOG_STATUS_LABELS } from '../../dogs/constants'
import { useAsync } from '../../../shared/hooks/useAsync'
import { adoptionRequestService } from '../services/adoptionRequestService'
import { chatService } from '../../chat/services/chatService'
import { useAuth } from '../../auth/context/AuthContext'

type DogAction = 'chat' | 'pending' | 'send'

export default function ShelterProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: shelter, loading, error } = useAsync(() =>
    id ? shelterService.getById(id) : Promise.reject('ID nije pronađen')
  )

  const [modalDogId, setModalDogId] = useState<string | null>(null)
  const [modalDogName, setModalDogName] = useState<string>('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function openModal(dogId: string, dogName: string) {
    setModalDogId(dogId)
    setModalDogName(dogName || 'Nepoznato ime')
    setNote('')
    setSubmitError(null)
  }

  function closeModal() {
    setModalDogId(null)
    setNote('')
    setSubmitError(null)
  }

  async function handleSubmitAdoption() {
    if (!modalDogId) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      await adoptionRequestService.create(modalDogId, note || undefined)
      closeModal()
    } catch {
      setSubmitError('Greška pri slanju zahteva. Pokušajte ponovo.')
    } finally {
      setSubmitting(false)
    }
  }

  function getDogAction(dog: any): DogAction {
    switch (dog.adoptionRequestStatus) {
      case 'Approved':
        return 'chat'
      case 'Pending':
        return 'pending'
      default:
        return 'send'
    }
  }

  async function handleOpenChat(dog: any) {
    try {
      if (!dog.adoptionRequestId) return

      navigate('/dashboard/owner/chat')
    } catch {
      alert('Greška pri otvaranju chata.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-white rounded-xl border border-gray-100 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white rounded-xl border border-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error || !shelter) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-3">🏢</p>
        <p className="text-sm">{error ?? 'Azil nije pronađen.'}</p>
        <button
          onClick={() => navigate('/dashboard/owner/shelters')}
          className="mt-3 text-xs text-woof-blue-600 hover:underline"
        >
          ← Nazad na azile
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard/owner/shelters')}
        className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
      >
        ← Nazad
      </button>

      <div className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-woof-blue-600 shadow-card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-woof-blue-100 flex items-center justify-center text-2xl">
            🏢
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {shelter.shelterName}
              </h1>
              <span className="text-xs text-woof-green-600 font-medium bg-woof-green-50 px-2 py-0.5 rounded-full">
                Verifikovan ✓
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-3">
              📍 {shelter.address}
            </p>

            <p className="text-sm text-gray-600">
              {shelter.description}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Psi u azilu ({shelter.dogs.length})
      </h2>

      {shelter.dogs.length === 0 ? (
        <div className="text-center py-14 text-gray-400">
          🐾 Nema pasa u ovom azilu
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shelter.dogs.map((dog: any) => {
            const action = getDogAction(dog)

            return (
              <div
                key={dog.id}
                className="bg-white rounded-xl border border-gray-100 shadow-card"
              >
                <div className="h-40 bg-gray-100 rounded-t-xl overflow-hidden">
                  {dog.imageUrl ? (
                    <img
                      src={dog.imageUrl}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      🐶
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium">{dog.name}</h3>

                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        DOG_STATUS_COLORS[dog.status as DogStatus]
                      }`}
                    >
                      {DOG_STATUS_LABELS[dog.status as DogStatus]}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {dog.description}
                  </p>

                  {user?.role === 'Owner' && dog.status === 'InShelter' &&
                    (action === 'chat' ? (
                      <button
                        onClick={() => handleOpenChat(dog)}
                        className="w-full py-2 text-xs bg-green-100 text-green-700 rounded-lg"
                      >
                        💬 Otvori chat
                      </button>
                    ) : action === 'pending' ? (
                      <div className="w-full py-2 text-xs text-gray-500 bg-gray-100 rounded-lg text-center">
                        ✓ Već poslat zahtev
                      </div>
                    ) : (
                      <button
                        onClick={() => openModal(dog.id, dog.name || '')}
                        className="w-full py-2 bg-woof-blue-600 text-white text-xs rounded-lg"
                      >
                        🐾 Pošalji zahtev
                      </button>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalDogId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={closeModal} />

          <div className="relative bg-white p-6 rounded-xl w-full max-w-md z-10">
            <h3 className="font-semibold mb-4">Zahtev za udomljavanje</h3>

            {submitError && (
              <div className="mb-3 text-red-600 text-xs">{submitError}</div>
            )}

            <textarea
              className="w-full border p-2 rounded mb-4"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Napomena..."
            />

            <button
              onClick={handleSubmitAdoption}
              disabled={submitting}
              className="w-full py-2 bg-woof-blue-600 text-white rounded"
            >
              {submitting ? 'Slanje...' : 'Pošalji'}
            </button>

            <button
              onClick={closeModal}
              className="mt-2 text-sm text-gray-500 w-full"
            >
              Otkaži
            </button>
          </div>
        </div>
      )}
    </div>
  )
}