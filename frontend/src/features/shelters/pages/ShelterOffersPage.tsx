import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  sittingOfferService,
  SittingOffer,
} from '../../sitter/services/sittingOfferService'

export default function ShelterOffersPage() {
  const navigate = useNavigate()
  const [offers, setOffers] = useState<SittingOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    sittingOfferService.getMy()
      .then(setOffers)
      .catch(() => setError('Greška pri učitavanju ponuda.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Da li ste sigurni da želite da obrišete ponudu?')) return
    try {
      await sittingOfferService.delete(id)
      setOffers((prev) => prev.filter((o) => o.id !== id))
    } catch {
      alert('Greška pri brisanju ponude.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Ponude čuvanja
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Upravljajte ponudama čuvanja vašeg azila
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/shelter/offers/new')}
          className="px-4 py-2 bg-woof-blue-600 hover:bg-woof-blue-700
                     text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Nova ponuda
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
      {!loading && !error && offers.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🏠</p>
          <p className="text-sm">Nemate još nijednu ponudu.</p>
          <button
            onClick={() => navigate('/dashboard/shelter/offers/new')}
            className="mt-4 px-4 py-2 bg-woof-blue-600 hover:bg-woof-blue-700
                       text-white text-sm font-medium rounded-lg transition-colors"
          >
            Kreiraj prvu ponudu
          </button>
        </div>
      )}

      {/* Lista */}
      {!loading && !error && offers.length > 0 && (
        <div className="space-y-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl border border-gray-100
                         shadow-card p-5 flex items-center gap-4"
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                offer.isActive ? 'bg-woof-green-500' : 'bg-gray-300'
              }`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {offer.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full
                                   font-medium shrink-0
                                   ${offer.isActive
                                     ? 'bg-woof-green-100 text-woof-green-700'
                                     : 'bg-gray-100 text-gray-500'
                                   }`}>
                    {offer.isActive ? 'Aktivna' : 'Neaktivna'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {offer.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>📍 {offer.city}</span>
                  <span>🐶 max {offer.maxDogsCapacity} pasa</span>
                  <span className="font-medium text-woof-blue-600">
                    {offer.pricePerHour.toFixed(2)} RSD / sat
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    navigate(`/dashboard/shelter/offers/${offer.id}/edit`)
                  }
                  className="px-3 py-1.5 text-xs text-gray-600 border
                             border-gray-200 rounded-lg hover:bg-gray-50
                             transition-colors"
                >
                  Izmeni
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="px-3 py-1.5 text-xs text-red-500 border
                             border-red-100 rounded-lg hover:bg-red-50
                             transition-colors"
                >
                  Obriši
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}