import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import { DASHBOARD_ROLES, UserRole } from '../types/auth'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="rounded-xl border border-border bg-card px-6 py-4 text-center shadow-sm">
        <h1 className="text-xl font-bold text-primary">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Page coming soon</p>
      </div>
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Storefront Routes */}
        <Route path="/" element={<PlaceholderPage title="PharmaWell Home" />} />
        <Route path="/categories" element={<PlaceholderPage title="All Categories" />} />
        <Route path="/products" element={<PlaceholderPage title="Product Catalog" />} />
        <Route path="/products/:productId" element={<PlaceholderPage title="Medicine Details" />} />

        {/* Guest-Only Auth Routes */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<PlaceholderPage title="Login" />} />
          <Route path="/register" element={<PlaceholderPage title="Register" />} />
          <Route path="/verify-email" element={<PlaceholderPage title="Verify Email (OTP)" />} />
          <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" />} />
        </Route>

        {/* Password reset link from email (works regardless of auth state) */}
        <Route path="/reset-password" element={<PlaceholderPage title="Reset Password" />} />

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
    </BrowserRouter>
  )
}