import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dogService, Dog, DogStatus } from '../../dogs/services/dogService'
import { DOG_STATUS_COLORS, DOG_STATUS_LABELS } from '../../dogs/constants'

export default function ShelterDogsPage() {
  const navigate = useNavigate()
  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dogService.getMy()
      .then(setDogs)
      .catch(() => setError('Greška pri učitavanju pasa.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Da li ste sigurni da želite da uklonite psa?')) return
    try {
      await dogService.delete(id)
      setDogs((prev) => prev.filter((d) => d.id !== id))
    } catch {
      alert('Greška pri brisanju.')
    }
  }

  async function handleStatusChange(id: string, status: DogStatus) {
    try {
      await dogService.updateStatus(id, status)
      setDogs((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d))
      )
    } catch {
      alert('Greška pri promeni statusa.')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Psi u azilu</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Upravljajte psima vašeg azila
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/shelter/dogs/new')}
          className="px-4 py-2 bg-woof-blue-600 hover:bg-woof-blue-700
                     text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Dodaj psa
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-xl border
                                    border-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Empty */}
      {!loading && !error && dogs.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🐕</p>
          <p className="text-sm">Nema pasa u azilu.</p>
          <button
            onClick={() => navigate('/dashboard/shelter/dogs/new')}
            className="mt-4 px-4 py-2 bg-woof-blue-600 hover:bg-woof-blue-700
                       text-white text-sm font-medium rounded-lg transition-colors"
          >
            Dodaj prvog psa
          </button>
        </div>
      )}

      {/* Lista */}
      {!loading && !error && dogs.length > 0 && (
        <div className="space-y-3">
          {dogs.map((dog) => (
            <DogRow
              key={dog.id}
              dog={dog}
              onStatusChange={(status) => handleStatusChange(dog.id, status)}
              onDelete={() => handleDelete(dog.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface DogRowProps {
  dog: Dog
  onStatusChange: (status: DogStatus) => void
  onDelete: () => void
}

function DogRow({ dog, onStatusChange, onDelete }: DogRowProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100
                    shadow-card p-4 flex items-center gap-4">
      {/* Slika */}
      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
        {dog.imageUrl ? (
          <img
            src={dog.imageUrl}
            alt={dog.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center
                          justify-center text-2xl">
            🐶
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-900 truncate">
            {dog.name || 'Nepoznato ime'}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                           shrink-0 ${DOG_STATUS_COLORS[dog.status]}`}>
            {DOG_STATUS_LABELS[dog.status]}
          </span>
        </div>
        {dog.breed && (
          <p className="text-xs text-gray-400 mb-1">{dog.breed}</p>
        )}
        <p className="text-xs text-gray-400">Opis: {dog.description}</p>
      </div>

      {/* Akcije */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Brza promena statusa */}
        {/* <select
          value={dog.status}
          onChange={(e) => onStatusChange(e.target.value as DogStatus)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5
                     text-gray-600 focus:outline-none focus:ring-2
                     focus:ring-woof-blue-400 bg-white"
        >
          {Object.entries(DOG_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select> */}

        <button
          onClick={onDelete}
          className="px-3 py-1.5 text-xs text-red-500 border border-red-100
                     rounded-lg hover:bg-red-50 transition-colors"
        >
          Ukloni
        </button>
      </div>
    </div>
  )
}