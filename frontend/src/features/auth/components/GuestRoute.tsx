import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_REDIRECT = {
  Owner:   '/dashboard/owner/my-dogs',
  Sitter:  '/dashboard/sitter/offers',
  Shelter: '/dashboard/shelter/dogs',
}

export default function GuestRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-gray-400">Učitavanje...</span>
      </div>
    )
  }

  if (user) {
    return <Navigate to={ROLE_REDIRECT[user.role]} replace />
  }

  return <Outlet />
}