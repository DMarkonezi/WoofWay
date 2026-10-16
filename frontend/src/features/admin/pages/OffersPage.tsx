import { useState } from 'react'
import { adminService } from '../services/adminService'
import { useAsync } from '../../../shared/hooks/useAsync'

export default function OffersPage() {
  const { data: offers, loading, error, refetch } = useAsync(
    () => adminService.getAllOffers(), []
  )

  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = offers?.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.city.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Obrisati ponudu "${title}"?`)) return
    setDeleting(id)
    try {
      await adminService.deleteOffer(id)
      refetch()
    } catch {
      alert('Greška pri brisanju ponude.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Ponude</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Sve aktivne ponude čuvanja
          </p>
        </div>
        {offers && (
          <span className="text-sm text-gray-400">
            Ukupno: {offers.length}
          </span>
        )}
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Pretraži po nazivu ili gradu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="woof-input max-w-sm text-sm"
        />
      </div>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-white rounded-xl border
                                    border-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm">Nema ponuda.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100
                        shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium
                               text-gray-500">
                  Naziv
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium
                               text-gray-500">
                  Grad
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium
                               text-gray-500">
                  Cena / sat
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium
                               text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b border-gray-50 last:border-0
                             hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 truncate max-w-xs">
                      {offer.title}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {offer.city}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700">
                    {offer.pricePerHour.toFixed(2)} RSD
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full
                                     font-medium
                                     ${offer.isActive
                                       ? 'bg-woof-green-100 text-woof-green-700'
                                       : 'bg-gray-100 text-gray-500'
                                     }`}>
                      {offer.isActive ? 'Aktivna' : 'Neaktivna'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(offer.id, offer.title)}
                      disabled={deleting === offer.id}
                      className="text-xs text-red-500 hover:text-red-700
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 transition-colors"
                    >
                      {deleting === offer.id ? 'Brisanje...' : 'Obriši'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}