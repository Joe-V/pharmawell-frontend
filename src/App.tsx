import { useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LogIn, LogOut, Moon, Sun } from 'lucide-react'
import { BrowserRouter, Link, useLocation } from 'react-router'
import { Button } from './components/ui/Button'
import { AuthProvider } from './context/AuthProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import { queryClient } from './lib/queryClient'
import { AppRouter } from './routes/AppRouter'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()

const AUTH_PATHS = [
  '/login',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/password-reset-success',
]

function DevAuthBar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const [loggingOut, setLoggingOut] = useState(false)

  if (AUTH_PATHS.some((path) => pathname.startsWith(path))) {
    return null
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="border-b border-border bg-navbar px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link to="/" className="text-lg font-bold text-primary">
          PharmaWell
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user?.fullName}{' '}
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                  {user?.role}
                </span>
              </span>

              <Button
                variant="outline"
                size="sm"
                isLoading={loggingOut}
                leftIcon={<LogOut className="h-4 w-4" />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" leftIcon={<LogIn className="h-4 w-4" />}>
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function App() {
  const appTree = (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <DevAuthBar />
            <AppRouter />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )

  if (!googleClientId) {
    return appTree
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {appTree}
    </GoogleOAuthProvider>
  )
}

export default App