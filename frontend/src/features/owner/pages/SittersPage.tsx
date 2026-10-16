import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  sittingOfferService,
  SittingOffer,
} from '../../sitter/services/sittingOfferService'

export default function SittersPage() {
  const navigate = useNavigate()
  const [offers, setOffers] = useState<SittingOffer[]>([])
  const [filtered, setFiltered] = useState<SittingOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cityFilter, setCityFilter] = useState('')

  useEffect(() => {
    sittingOfferService.getAll()
      .then((data) => {
        setOffers(data)
        setFiltered(data)
      })
      .catch(() => setError('Greška pri učitavanju ponuda.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!cityFilter.trim()) {
      setFiltered(offers)
      return
    }
    setFiltered(
      offers.filter((o) =>
        o.city.toLowerCase().includes(cityFilter.toLowerCase())
      )
    )
  }, [cityFilter, offers])

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Čuvari</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Pronađite pouzdanog čuvara za vašeg psa
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-100
                      shadow-card p-4 mb-6">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <p className="text-xs text-gray-400 mb-2">Grad</p>
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
          {filtered.length} {filtered.length === 1 ? 'ponuda' : 'ponuda'}
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
          <p className="text-4xl mb-3">🏠</p>
          <p className="text-sm">Nema dostupnih čuvara.</p>
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
          {filtered.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onClick={() =>
                navigate(`/dashboard/owner/sitters/${offer.id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

function OfferCard({
  offer,
  onClick,
}: {
  offer: SittingOffer
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 shadow-card
                 hover:shadow-md transition-shadow cursor-pointer p-5"
    >
      {/* Avatar placeholder */}
      <div className="w-12 h-12 rounded-full bg-woof-blue-100
                      flex items-center justify-center
                      text-woof-blue-600 text-xl font-semibold mb-4">
        🐾
      </div>

      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
        {offer.title}
      </h3>

      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
        {offer.description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>📍 {offer.city}</span>
        <span>🐶 max {offer.maxDogsCapacity} psa</span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100
                      flex items-center justify-between">
        <span className="text-sm font-semibold text-woof-blue-600">
          {offer.pricePerHour.toFixed(2)} RSD / sat
        </span>
        <span className="text-xs text-woof-green-600 font-medium">
          Dostupno
        </span>
      </div>
    </div>
  )
}