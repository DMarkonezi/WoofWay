import { useEffect, useState } from 'react'
import { dogService, Dog, DogStatus } from '../../dogs/services/dogService'
import { Owner_DogCard } from '../components/cards/Owner.DogCard'
import { useDogs } from '../../dogs/hooks/useDogs'

type Tab = 'lost' | 'spotted'

const LOST_STATUSES: DogStatus[] = ['Lost']
const SPOTTED_STATUSES: DogStatus[] = ['Spotted', 'InShelter']

export default function LostDogsPage() {

  const { dogs, loading, error } = useDogs();

  const [activeTab, setActiveTab] = useState<Tab>('lost')
  const [cityFilter, setCityFilter] = useState('')

  const filtered = dogs.filter((d) => {
    const statusMatch = activeTab === 'lost'
      ? LOST_STATUSES.includes(d.status)
      : SPOTTED_STATUSES.includes(d.status)

    const cityMatch = !cityFilter.trim() ||
      d.location.toLowerCase().includes(cityFilter.toLowerCase())

    return statusMatch && cityMatch
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Psi</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Pronađite izgubljene pse ili prijavite uočenog psa
        </p>
      </div>

      {/* Tabovi */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => {
            setActiveTab('lost')
            setCityFilter('')
          }}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
                     ${activeTab === 'lost'
                       ? 'bg-white text-gray-900 shadow-sm'
                       : 'text-gray-500 hover:text-gray-700'
                     }`}
        >
          🔴 Oglasi
        </button>
        <button
          onClick={() => {
            setActiveTab('spotted')
            setCityFilter('')
          }}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
                     ${activeTab === 'spotted'
                       ? 'bg-white text-gray-900 shadow-sm'
                       : 'text-gray-500 hover:text-gray-700'
                     }`}
        >
          📸 Uočeni ili u azilu
        </button>
      </div>

      {/* Info za spotted tab */}
      {activeTab === 'spotted' && (
        <div className="mb-5 rounded-lg bg-yellow-50 border border-yellow-100
                        px-4 py-3">
          <p className="text-xs text-yellow-700">
            Ovde se nalaze psi koje su prolaznici uslikali na ulici, kao i psi
            koji su nedavno doneti u azile. Ako prepoznajete svog psa,
            kontaktirajte nas.
          </p>
        </div>
      )}

      {/* Filter po gradu */}
      <div className="bg-white rounded-xl border border-gray-100
                      shadow-card p-4 mb-6">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <p className="text-xs text-gray-400 mb-2">Grad / lokacija</p>
            <input
              type="text"
              placeholder="Pretraži po gradu..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="woof-input text-sm"
            />
          </div>
          {cityFilter && (
            <button
              onClick={() => setCityFilter('')}
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
          {filtered.length} {filtered.length === 1 ? 'oglas' : 'oglasa'}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 bg-white rounded-xl border
                                    border-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">
            {activeTab === 'lost' ? '🔍' : '📸'}
          </p>
          <p className="text-sm">
            {activeTab === 'lost'
              ? 'Nema prijavljenih nestalih pasa.'
              : 'Nema uočenih pasa u ovoj oblasti.'
            }
          </p>
          {cityFilter && (
            <button
              onClick={() => setCityFilter('')}
              className="mt-3 text-xs text-woof-blue-600 hover:underline"
            >
              Poništi filter
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dog) => (
            <Owner_DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  )
}