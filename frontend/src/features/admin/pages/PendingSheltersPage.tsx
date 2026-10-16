import { useState } from 'react'
import { adminService, PendingShelter } from '../services/adminService'
import { useAsync } from '../../../shared/hooks/useAsync'

export default function PendingSheltersPage() {
  const {
    data: shelters,
    loading,
    error,
    refetch,
  } = useAsync(() => adminService.getPendingShelters(), [])

  const [processing, setProcessing] = useState<string | null>(null)

  async function handleApprove(id: string) {
    if (!confirm('Odobriti ovaj azil?')) return
    setProcessing(id)
    try {
      await adminService.approveShelter(id)
      refetch()
    } catch {
      alert('Greška pri odobravanju.')
    } finally {
      setProcessing(null)
    }
  }

  async function handleReject(id: string) {
    if (!confirm('Odbiti i obrisati ovaj azil? Ova akcija je nepovratna.')) return
    setProcessing(id)
    try {
      await adminService.rejectShelter(id)
      refetch()
    } catch {
      alert('Greška pri odbijanju.')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Verifikacija azila
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Azili koji čekaju na odobrenje
        </p>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 bg-white rounded-xl border
                                    border-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (!shelters || shelters.length === 0) && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-sm">Nema azila koji čekaju verifikaciju.</p>
        </div>
      )}

      {!loading && !error && shelters && shelters.length > 0 && (
        <div className="space-y-4">
          {shelters.map((shelter) => (
            <ShelterCard
              key={shelter.shelterId}
              shelter={shelter}
              processing={processing === shelter.shelterId}
              onApprove={() => handleApprove(shelter.shelterId)}
              onReject={() => handleReject(shelter.shelterId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ShelterCardProps {
  shelter: PendingShelter
  processing: boolean
  onApprove: () => void
  onReject: () => void
}

function ShelterCard({
  shelter,
  processing,
  onApprove,
  onReject,
}: ShelterCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900">
              {shelter.shelterName}
            </h3>
            <span className="text-xs bg-yellow-100 text-yellow-700
                             px-2 py-0.5 rounded-full font-medium">
              Na čekanju
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Reg. broj: {shelter.registrationNumber}
          </p>
        </div>
        <p className="text-xs text-gray-400 shrink-0">
          {new Date(shelter.createdAt).toLocaleDateString('sr-RS')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div>
          <p className="text-gray-400 mb-0.5">Email</p>
          <p className="text-gray-700">{shelter.contactEmail}</p>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">Adresa</p>
          <p className="text-gray-700">{shelter.address}</p>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">Kapacitet</p>
          <p className="text-gray-700">{shelter.capacity} pasa</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg
                    px-3 py-2 mb-4">
        {shelter.description}
      </p>

      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        <button
          onClick={onApprove}
          disabled={processing}
          className="flex-1 py-2 bg-woof-green-600 hover:bg-woof-green-700
                     text-white text-xs font-medium rounded-lg
                     transition-colors disabled:opacity-60
                     disabled:cursor-not-allowed"
        >
          ✓ Odobri azil
        </button>
        <button
          onClick={onReject}
          disabled={processing}
          className="flex-1 py-2 bg-white hover:bg-red-50 text-red-500
                     border border-red-100 text-xs font-medium rounded-lg
                     transition-colors disabled:opacity-60
                     disabled:cursor-not-allowed"
        >
          ✕ Odbij i obriši
        </button>
      </div>
    </div>
  )
}