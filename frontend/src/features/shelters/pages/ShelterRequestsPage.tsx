import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAsync } from '../../../shared/hooks/useAsync'
import {
  shelterAdoptionService,
  AdoptionRequest,
} from '../services/adoptionRequestService'
import {
  sittingRequestService,
  SittingRequest,
} from '../../sitter/services/sittingRequestService'
import { chatService } from '../../chat/services/chatService'

type Tab = 'adoption' | 'sitting'

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

export default function ShelterRequestsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('adoption')

  const {
    data: adoptionRequests,
    loading: loadingAdoption,
    error: errorAdoption,
    refetch: refetchAdoption,
  } = useAsync(() => shelterAdoptionService.getMy(), [])

  const {
    data: sittingRequests,
    loading: loadingSitting,
    error: errorSitting,
    refetch: refetchSitting,
  } = useAsync(() => sittingRequestService.getMy(), [])

  const [processingAdoption, setProcessingAdoption] = useState<string | null>(null)
  const [processingSitting, setProcessingSitting] = useState<string | null>(null)
  const [openingChat, setOpeningChat] = useState<string | null>(null)

  async function handleAdoptionStatus(id: string, status: 'Approved' | 'Rejected') {
    setProcessingAdoption(id)
    try {
      await shelterAdoptionService.updateStatus(id, status)
      refetchAdoption()
    } catch {
      alert('Greška pri ažuriranju statusa.')
    } finally {
      setProcessingAdoption(null)
    }
  }


  async function handleSittingStatus(id: string, status: 'Approved' | 'Rejected') {
    setProcessingSitting(id)
    try {
      await sittingRequestService.updateStatus(id, status)
      if (status === 'Approved') {
        try {
          await chatService.openRoom(id, 'Sitting')
        } catch {
          
        }
      }
      refetchSitting()
    } catch {
      alert('Greška pri ažuriranju statusa.')
    } finally {
      setProcessingSitting(null)
    }
  }

  async function handleOpenChat(
    requestId: string,
    type: 'Sitting' | 'Adoption'
  ) {
    setOpeningChat(requestId)
    try {
      await chatService.openRoom(requestId, type)
      navigate('/dashboard/shelter/chat')
    } catch {
      alert('Greška pri otvaranju chata.')
    } finally {
      setOpeningChat(null)
    }
  }

  const pendingAdoption =
    adoptionRequests?.filter((r) => r.status === 'Pending').length ?? 0
  const pendingSitting =
    sittingRequests?.filter((r) => r.status === 'Pending').length ?? 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Zahtevi</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Zahtevi za udomljavanje i čuvanje pasa
        </p>
      </div>

      {/* Tabovi */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('adoption')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
                     ${activeTab === 'adoption'
                       ? 'bg-white text-gray-900 shadow-sm'
                       : 'text-gray-500 hover:text-gray-700'
                     }`}
        >
          🐾 Udomljavanje
          {pendingAdoption > 0 && (
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-700
                             px-1.5 py-0.5 rounded-full">
              {pendingAdoption}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sitting')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
                     ${activeTab === 'sitting'
                       ? 'bg-white text-gray-900 shadow-sm'
                       : 'text-gray-500 hover:text-gray-700'
                     }`}
        >
          🏠 Čuvanje
          {pendingSitting > 0 && (
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-700
                             px-1.5 py-0.5 rounded-full">
              {pendingSitting}
            </span>
          )}
        </button>
      </div>

      {/* Udomljavanje */}
      {activeTab === 'adoption' && (
        <>
          {loadingAdoption && <LoadingSkeleton />}
          {errorAdoption && (
            <p className="text-sm text-red-500">{errorAdoption}</p>
          )}
          {!loadingAdoption && !errorAdoption &&
            (!adoptionRequests || adoptionRequests.length === 0) && (
              <Empty
                icon="🐾"
                message="Nema zahteva za udomljavanje."
              />
            )}
          {!loadingAdoption && !errorAdoption && adoptionRequests &&
            adoptionRequests.length > 0 && (
              <div className="space-y-3">
                {adoptionRequests.map((req) => (
                  <AdoptionCard
                    key={req.id}
                    request={req}
                    processing={processingAdoption === req.id}
                    openingChat={openingChat === req.id}
                    onApprove={() =>
                      handleAdoptionStatus(req.id, 'Approved')
                    }
                    onReject={() =>
                      handleAdoptionStatus(req.id, 'Rejected')
                    }
                    onOpenChat={() =>
                      handleOpenChat(req.id, 'Adoption')
                    }
                  />
                ))}
              </div>
            )}
        </>
      )}

      {/* Tab: Čuvanje  */}
      {activeTab === 'sitting' && (
        <>
          {loadingSitting && <LoadingSkeleton />}
          {errorSitting && (
            <p className="text-sm text-red-500">{errorSitting}</p>
          )}
          {!loadingSitting && !errorSitting &&
            (!sittingRequests || sittingRequests.length === 0) && (
              <Empty
                icon="🏠"
                message="Nema zahteva za čuvanje."
              />
            )}
          {!loadingSitting && !errorSitting && sittingRequests &&
            sittingRequests.length > 0 && (
              <div className="space-y-3">
                {sittingRequests.map((req) => (
                  <SittingCard
                    key={req.id}
                    request={req}
                    processing={processingSitting === req.id}
                    openingChat={openingChat === req.id}
                    onApprove={() =>
                      handleSittingStatus(req.id, 'Approved')
                    }
                    onReject={() =>
                      handleSittingStatus(req.id, 'Rejected')
                    }
                    onOpenChat={() =>
                      handleOpenChat(req.id, 'Sitting')
                    }
                  />
                ))}
              </div>
            )}
        </>
      )}
    </div>
  )
}


interface AdoptionCardProps {
  request: AdoptionRequest
  processing: boolean
  openingChat: boolean
  onApprove: () => void
  onReject: () => void
  onOpenChat: () => void
}

function AdoptionCard({
  request,
  processing,
  openingChat,
  onApprove,
  onReject,
  onOpenChat,
}: AdoptionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-medium text-gray-900 mb-0.5">
            🐾 {request.dogName}
          </h3>
          <p className="text-xs text-gray-400">
            Podnosilac:{' '}
            <span className="text-gray-600">{request.adopterFullName}</span>
          </p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                         shrink-0 ${STATUS_COLORS[request.status]}`}>
          {STATUS_LABELS[request.status]}
        </span>
      </div>

      {request.note && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg
                      px-3 py-2 mb-3">
          📝 {request.note}
        </p>
      )}

      {request.status === 'Pending' && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={onApprove}
            disabled={processing}
            className="flex-1 py-2 bg-woof-green-600 hover:bg-woof-green-700
                       text-white text-xs font-medium rounded-lg
                       transition-colors disabled:opacity-60
                       disabled:cursor-not-allowed"
          >
            ✓ Odobri
          </button>
          <button
            onClick={onReject}
            disabled={processing}
            className="flex-1 py-2 bg-white hover:bg-red-50 text-red-500
                       border border-red-100 text-xs font-medium rounded-lg
                       transition-colors disabled:opacity-60
                       disabled:cursor-not-allowed"
          >
            ✕ Odbij
          </button>
        </div>
      )}

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


interface SittingCardProps {
  request: SittingRequest
  processing: boolean
  openingChat: boolean
  onApprove: () => void
  onReject: () => void
  onOpenChat: () => void
}

function SittingCard({
  request,
  processing,
  openingChat,
  onApprove,
  onReject,
  onOpenChat,
}: SittingCardProps) {
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
            Vlasnik:{' '}
            <span className="text-gray-600">{request.ownerName}</span>
            {' · '}
            Pas:{' '}
            <span className="text-gray-600">{request.dogName}</span>
          </p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                         shrink-0 ${STATUS_COLORS[request.status]}`}>
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

      {request.status === 'Pending' && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={onApprove}
            disabled={processing}
            className="flex-1 py-2 bg-woof-green-600 hover:bg-woof-green-700
                       text-white text-xs font-medium rounded-lg
                       transition-colors disabled:opacity-60
                       disabled:cursor-not-allowed"
          >
            ✓ Odobri
          </button>
          <button
            onClick={onReject}
            disabled={processing}
            className="flex-1 py-2 bg-white hover:bg-red-50 text-red-500
                       border border-red-100 text-xs font-medium rounded-lg
                       transition-colors disabled:opacity-60
                       disabled:cursor-not-allowed"
          >
            ✕ Odbij
          </button>
        </div>
      )}

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

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 bg-white rounded-xl border
                                border-gray-100 animate-pulse" />
      ))}
    </div>
  )
}

function Empty({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="text-sm">{message}</p>
    </div>
  )
}