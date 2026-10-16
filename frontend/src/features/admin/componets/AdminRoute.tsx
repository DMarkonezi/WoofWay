import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../auth/context/AuthContext"

export function AdminRoute() {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  if (!user || user.role !== 'Admin') return <Navigate to="/" replace />
  return <Outlet />
}