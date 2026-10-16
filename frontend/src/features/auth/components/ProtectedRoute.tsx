import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { notificationSignalRService } from '../../../shared/services/NotificationSignalR'

interface Props {
  allowedRoles?: string[]
  children?: React.ReactNode
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem('woof_token')
    if (!isLoading && user && token) {
      notificationSignalRService.connect(token)
    }
    return () => {
      notificationSignalRService.disconnect()
    }
  }, [isLoading, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-gray-400">Učitavanje...</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children ? <>{children}</> : <Outlet />
}