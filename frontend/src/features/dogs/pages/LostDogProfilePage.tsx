import { useParams, useNavigate } from 'react-router-dom'
import { useAsync } from '../../../shared/hooks/useAsync'
import { dogService } from '../services/dogService'

export default function LostDogProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: dog, loading, error } = useAsync(
    () => dogService.getById(id!),
    [id]
  )

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
      </div>
    )
  }

  if (error || !dog) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
        <p className="text-4xl mb-3">🐾</p>
        <p className="text-sm">Oglas nije pronađen.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-xs text-woof-blue-600 hover:underline"
        >
          ← Nazad
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-gray-400 hover:text-gray-600 
                   transition-colors mb-6 flex items-center gap-1"
      >
        ← Nazad
      </button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
        {/* Slika */}
        <div className="h-72 bg-gray-100">
          {dog.imageUrl ? (
            <img
              src={dog.imageUrl}
              alt={dog.name || 'Pas'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              🐶
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Naziv + status */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {dog.creatorId || 'Nepoznato ime'}
            </h1>
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium">
              🔴 Nestao/la
            </span>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {dog.breed && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Rasa</p>
                <p className="text-gray-700">{dog.breed}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Lokacija</p>
              <p className="text-gray-700">📍 {dog.location}</p>
            </div>
            {dog.eventDate && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Datum nestanka</p>
                <p className="text-gray-700">
                  {new Date(dog.eventDate).toLocaleDateString('sr-RS')}
                </p>
              </div>
            )}
          </div>

          {/* Opis */}
          {dog.description && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Opis</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {dog.description}
              </p>
            </div>
          )}

          {/* Info boks */}
          <div className="rounded-lg bg-yellow-50 border border-yellow-100 px-4 py-3">
            <p className="text-xs text-yellow-700">
              💡 Ako ste videli ovog psa, kontaktirajte vlasnika putem podataka 
              navedenih u opisu oglasa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}