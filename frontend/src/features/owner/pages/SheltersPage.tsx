import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { shelterService, Shelter } from '../../shelters/services/shelterService'
import { Owner_ShelterCard } from '../components/cards/Owner.ShelterCard'

export default function SheltersPage() {
  const navigate = useNavigate()
  const [shelters, setShelters] = useState<Shelter[]>([])
  const [filtered, setFiltered] = useState<Shelter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    shelterService.getAll()
      .then((data) => {
        setShelters(data)
        setFiltered(data)
      })
      .catch(() => setError('Greška pri učitavanju azila.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(shelters)
      return
    }
    setFiltered(
      shelters.filter(
        (s) =>
          s.shelterName.toLowerCase().includes(search.toLowerCase()) ||
          s.address.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [search, shelters])

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Azili</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Verifikovani azili na platformi
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-100
                      shadow-card p-4 mb-6">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <p className="text-xs text-gray-400 mb-2">Pretraga</p>
            <input
              type="text"
              placeholder="Naziv ili adresa azila..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="woof-input text-sm"
            />
          </div>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-gray-400 hover:text-gray-600
                         transition-colors pb-2"
            >
              ✕ Poništi
            </button>
          )}
        </div>
      </div>

      {/* Broj rezultata */}
      {!loading && !error && (
        <p className="text-xs text-gray-400 mb-4">
          {filtered.length} {filtered.length === 1 ? 'azil' : 'azila'}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-xl border
                                    border-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🏢</p>
          <p className="text-sm">Nema pronađenih azila.</p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-xs text-woof-blue-600 hover:underline"
            >
              Poništi pretragu
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((shelter) => (
            <Owner_ShelterCard
              key={shelter.id}
              shelter={shelter}
              onClick={() =>
                navigate(`/dashboard/owner/shelters/${shelter.id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}