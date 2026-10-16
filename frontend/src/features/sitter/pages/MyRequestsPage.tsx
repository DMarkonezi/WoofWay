import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  sittingRequestService,
  SittingRequest,
} from '../services/sittingRequestService'
import { chatService } from '../../chat/services/chatService'

const STATUS_LABELS: Record<string, string> = {
  Pending:   'Na čekanju',
  Approved:  'Odobreno',
  Rejected:  'Odbijeno',
  Cancelled: 'Otkazano',
}

const STATUS_COLORS: Record<string, string> = {
  Pending:   'bg-yellow-100 text-yellow-700',
  Approved:  'bg-woof-green-100 text-woof-green-700',
  Rejected:  'bg-red-100 text-red-700',
  Cancelled: 'bg-gray-100 text-gray-500',
}

export default function MyRequestsPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<SittingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openingChat, setOpeningChat] = useState<string | null>(null)

  useEffect(() => {
    sittingRequestService.getMy()
      .then(setRequests)
      .catch(() => setError('Greška pri učitavanju zahteva.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleStatus(id: string, status: 'Approved' | 'Rejected') {
    try {
      await sittingRequestService.updateStatus(id, status)
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )

      // Kad se odobri — automatski kreiraj chat sobu
      if (status === 'Approved') {
        try {
          await chatService.openRoom(id, 'Sitting')
        } catch {
      
        }
      }
    } catch {
      alert('Greška pri ažuriranju statusa.')
    }
  }

  async function handleOpenChat(requestId: string) {
    setOpeningChat(requestId)
    try {
      await chatService.openRoom(requestId, 'Sitting')
      navigate('/dashboard/sitter/chat')
    } catch {
      alert('Greška pri otvaranju chata.')
    } finally {
      setOpeningChat(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Primljeni zahtevi
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Zahtevi vlasnika pasa za vaše ponude
        </p>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-xl border
                                    border-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">Nemate primljenih zahteva.</p>
        </div>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              openingChat={openingChat === req.id}
              onApprove={() => handleStatus(req.id, 'Approved')}
              onReject={() => handleStatus(req.id, 'Rejected')}
              onOpenChat={() => handleOpenChat(req.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface RequestCardProps {
  request: SittingRequest
  openingChat: boolean
  onApprove: () => void
  onReject: () => void
  onOpenChat: () => void
}

function RequestCard({
  request,
  openingChat,
  onApprove,
  onReject,
  onOpenChat,
}: RequestCardProps) {
  const start = new Date(request.startTime)
  const end = new Date(request.endTime)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-medium text-gray-900 mb-0.5">
            {request.offerTitle}
          </h3>
          <p className="text-xs text-gray-400">
            Vlasnik: <span className="text-gray-600">{request.ownerName}</span>
            {' · '}
            Pas: <span className="text-gray-600">{request.dogName}</span>
          </p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0
                         ${STATUS_COLORS[request.status]}`}>
          {STATUS_LABELS[request.status]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400 mb-0.5">Od</p>
          <p className="text-xs font-medium text-gray-700">
            {start.toLocaleDateString('sr-RS')}
          </p>
          <p className="text-xs text-gray-500">
            {start.toLocaleTimeString('sr-RS', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400 mb-0.5">Do</p>
          <p className="text-xs font-medium text-gray-700">
            {end.toLocaleDateString('sr-RS')}
          </p>
          <p className="text-xs text-gray-500">
            {end.toLocaleTimeString('sr-RS', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400 mb-0.5">Ukupno</p>
          <p className="text-xs font-medium text-woof-blue-600">
            {request.totalPrice.toFixed(2)} RSD
          </p>
        </div>
      </div>

      {request.note && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg
                      px-3 py-2 mb-3">
          📝 {request.note}
        </p>
      )}

      {/* Akcije */}
      {request.status === 'Pending' && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={onApprove}
            className="flex-1 py-2 bg-woof-green-600 hover:bg-woof-green-700
                       text-white text-xs font-medium rounded-lg transition-colors"
          >
            ✓ Odobri
          </button>
          <button
            onClick={onReject}
            className="flex-1 py-2 bg-white hover:bg-red-50 text-red-500
                       border border-red-100 text-xs font-medium rounded-lg
                       transition-colors"
          >
            ✕ Odbij
          </button>
        </div>
      )}

      {/* Chat dugme — samo kad je odobreno */}
      {request.status === 'Approved' && (
        <div className="pt-3 border-t border-gray-100">
          <button
            onClick={onOpenChat}
            disabled={openingChat}
            className="w-full py-2 bg-woof-blue-600 hover:bg-woof-blue-700
                       text-white text-xs font-medium rounded-lg
                       transition-colors disabled:opacity-60
                       disabled:cursor-not-allowed flex items-center
                       justify-center gap-2"
          >
            <span>💬</span>
            {openingChat ? 'Otvaranje...' : 'Otvori chat'}
          </button>
        </div>
      )}
    </div>
  )
}