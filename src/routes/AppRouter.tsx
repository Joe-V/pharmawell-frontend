import { Navigate, Route, Routes } from 'react-router'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { PasswordResetSuccessPage } from '../pages/auth/PasswordResetSuccessPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage'
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import { DASHBOARD_ROLES, UserRole } from '../types/auth'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-background p-6 text-foreground">
      <div className="rounded-xl border border-border bg-card px-6 py-4 text-center shadow-sm">
        <h1 className="text-xl font-bold text-primary">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Page coming soon</p>
      </div>
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public Storefront Routes */}
      <Route path="/" element={<PlaceholderPage title="PharmaWell Home" />} />
      <Route path="/categories" element={<PlaceholderPage title="All Categories" />} />
      <Route path="/products" element={<PlaceholderPage title="Product Catalog" />} />
      <Route path="/products/:productId" element={<PlaceholderPage title="Medicine Details" />} />

      {/* Guest-Only Auth Routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Password reset routes from email */}
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/password-reset-success" element={<PasswordResetSuccessPage />} />

      {/* Any Authenticated User (Profile) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
      </Route>

      {/* Customer-Only Routes */}
      <Route element={<RoleRoute allowedRoles={[UserRole.Customer]} />}>
        <Route path="/cart" element={<PlaceholderPage title="Shopping Cart" />} />
        <Route path="/checkout" element={<PlaceholderPage title="Checkout" />} />
        <Route path="/my-orders" element={<PlaceholderPage title="Order History" />} />
        <Route path="/my-orders/:orderId" element={<PlaceholderPage title="Order Details" />} />
      </Route>

      {/* Admin & Pharmacist Routes */}
      <Route element={<RoleRoute allowedRoles={DASHBOARD_ROLES} />}>
        <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" />} />
        <Route path="/admin/products" element={<PlaceholderPage title="Inventory Management" />} />
        <Route path="/admin/categories" element={<PlaceholderPage title="Category Management" />} />
        <Route path="/admin/orders" element={<PlaceholderPage title="Admin Orders" />} />
        <Route path="/admin/orders/:orderId" element={<PlaceholderPage title="Admin Order Details" />} />
        <Route path="/admin/profile" element={<PlaceholderPage title="Admin Profile" />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}