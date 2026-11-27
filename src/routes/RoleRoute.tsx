import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { getDefaultRouteForRole, type UserRole } from '../types/auth'

type RoleRouteProps = {
  allowedRoles: readonly UserRole[]
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />
  }

  return <Outlet />
}