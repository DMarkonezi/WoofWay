import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAsync } from '../../../shared/hooks/useAsync'
import { dogService, Dog } from '../services/dogService'
import { useEffect } from 'react'

export default function BreedMatchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const breed = searchParams.get('breed') ?? ''

  const { data: allDogs, loading, error } = useAsync(
    () => dogService.getAll('Lost'),
    []
  )

  const matched: Dog[] = (allDogs ?? []).filter(
    (d) => d.breed?.toLowerCase() === breed.toLowerCase()
  )

  useEffect(() => {
    if (allDogs && allDogs.length > 0) {
      console.log('Stigao objekat sa bekhenda (prvi pas):', allDogs[0]);
      console.log('Svi psi koji su stigli:', allDogs);
    }
  }, [allDogs])

  return (

    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-gray-400 hover:text-gray-600 
                   transition-colors mb-6 flex items-center gap-1"
      >
        ← Nazad
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Nestali psi — rasa: <span className="text-woof-blue-600">
            {breed.replace(/_/g, ' ')}
          </span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          AI je prepoznao rasu — proverite da li je jedan od ovih pasa onaj kojeg ste videli
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 bg-white rounded-xl border
                                    border-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">Greška pri učitavanju pasa.</p>
      )}

      {!loading && !error && matched.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">
            Nema prijavljenih nestalih pasa ove rase.
          </p>
        </div>
      )}

      {!loading && !error && matched.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matched.map((dog) => (
            <div key={dog.id} className="bg-white rounded-xl border border-gray-100
                                         shadow-card overflow-hidden">
              <div className="h-44 bg-gray-100">
                {dog.imageUrl ? (
                  <img
                    src={dog.imageUrl}
                    alt={dog.name || 'Pas'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center
                                  justify-center text-3xl">🐶</div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-medium text-gray-900">
                  {dog.name || 'Nepoznato ime'}
                </h3>

                <p className="text-xs text-gray-400">
                  📍 {dog.location}
                </p>

                {dog.eventDate && (
                  <p className="text-xs text-gray-400">
                    📅 {new Date(dog.eventDate).toLocaleDateString('sr-RS')}
                  </p>
                )}

                {dog.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {dog.description}
                  </p>
                )}

                {/* <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    💬 Kontakt vlasnika u opisu oglasa
                  </p>
                </div> */}

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Kontakt:</span>
                    {dog.contactPhone ? (
                        <a
                        href={`tel:${dog.contactPhone}`}
                        className="text-sm font-semibold text-woof-blue-600 hover:text-woof-blue-700 
                                    transition-colors flex items-center gap-1"
                        >
                        📞 {dog.contactPhone}
                        </a>
                    ) : (
                        <span className="text-xs italic text-gray-400">Nije ostavljen telefon</span>
                    )}
                    </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}