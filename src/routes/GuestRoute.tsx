import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { getDefaultRouteForRole } from '../types/auth'

export function GuestRoute() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />
  }

  return <Outlet />
}