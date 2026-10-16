import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'
import { AppNotification, notificationService } from '../services/notificationService'
import { notificationSignalRService } from '../services/NotificationSignalR'

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  useEffect(() => {
    notificationService.getMy()
      .then((data) => setNotifications(data ?? []))
      .catch(() => setNotifications([]))
  }, [])

  useEffect(() => {
    if (!user) return

    notificationSignalRService.onNotification((notif) => {
      
      setNotifications((prev) => [notif, ...prev])
    })

    return () => {
      notificationSignalRService.offNotification()
    }
  }, [user])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const PROFILE_ROUTE = {
    Owner:   '/dashboard/owner/profile',
    Sitter:  '/dashboard/sitter/profile',
    Shelter: '/dashboard/shelter/profile',
    Admin: '/dashboard/admin'
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100
                       flex items-center justify-between px-4 lg:px-6
                       sticky top-0 z-30">

      {/* Hamburger — samo mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500
                   hover:bg-gray-100 transition-colors"
        aria-label="Otvori meni"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="hidden lg:block" />

      {/* Desna strana */}
      <div className="flex items-center gap-2">

        {/* Zvonce */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-lg text-gray-500
                       hover:bg-gray-100 transition-colors"
            aria-label="Notifikacije"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
                       6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388
                       6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3
                       0 11-6 0v-1m6 0H9" />
            </svg>

            {/* Badge */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500
                               text-white text-xs rounded-full flex items-center
                               justify-center font-medium leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown notifikacija */}
          {notifOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setNotifOpen(false)}
              />

              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl
                              border border-gray-100 shadow-lg z-20 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3
                                border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    Notifikacije
                  </p>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-woof-blue-600 hover:underline"
                    >
                      Označi sve kao pročitano
                    </button>
                  )}
                </div>

                {/* Lista */}
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-2xl mb-2">🔔</p>
                      <p className="text-xs">Nema notifikacija</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-gray-50
                                   last:border-0 transition-colors
                                   ${!n.isRead ? 'bg-woof-blue-50' : 'bg-white'}`}
                      >
                        <div className="flex items-start gap-2">
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-woof-blue-600
                                            shrink-0 mt-1.5" />
                          )}
                          <div className={!n.isRead ? '' : 'ml-4'}>
                            <p className="text-xs font-medium text-gray-900">
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {n.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profil dugme */}
        <button
          onClick={() => {
            if (user) navigate(PROFILE_ROUTE[user.role])
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                     hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm text-gray-600 hidden sm:block">
            {user?.firstName}
          </span>
          <div className="w-8 h-8 rounded-full bg-woof-blue-100
                          flex items-center justify-center
                          text-woof-blue-600 text-sm font-medium shrink-0">
            {user?.firstName?.[0]?.toUpperCase() ?? '?'}
          </div>
        </button>

      </div>
    </header>
  )
}