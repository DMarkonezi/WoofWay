import { useState } from 'react'
import { adminService } from '../services/adminService'
import { useAsync } from '../../../shared/hooks/useAsync'

const ROLE_COLORS: Record<string, string> = {
  Owner:   'bg-woof-blue-100 text-woof-blue-700',
  Sitter:  'bg-purple-100 text-purple-700',
  Shelter: 'bg-yellow-100 text-yellow-700',
  Admin:   'bg-red-100 text-red-700',
}

export default function UsersPage() {
  const { data: users, loading, error, refetch } = useAsync(
    () => adminService.getAllUsers(), []
  )

  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = users?.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  ) ?? []

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Obrisati korisnika "${name}"? Ova akcija je nepovratna.`)) return
    setDeleting(id)
    try {
      await adminService.deleteUser(id)
      refetch()
    } catch {
      alert('Greška pri brisanju korisnika.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Korisnici</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Svi registrovani korisnici
          </p>
        </div>
        {users && (
          <span className="text-sm text-gray-400">
            Ukupno: {users.length}
          </span>
        )}
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Pretraži po imenu ili emailu..."
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
          <p className="text-3xl mb-2">👥</p>
          <p className="text-sm">Nema korisnika.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium
                               text-gray-500">
                  Korisnik
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium
                               text-gray-500">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium
                               text-gray-500">
                  Rola
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-50 last:border-0
                             hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full
                                     font-medium
                                     ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        handleDelete(
                          user.id,
                          `${user.firstName} ${user.lastName}`
                        )
                      }
                      disabled={deleting === user.id || user.role === 'Admin'}
                      className="text-xs text-red-500 hover:text-red-700
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 transition-colors"
                    >
                      {deleting === user.id ? 'Brisanje...' : 'Obriši'}
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