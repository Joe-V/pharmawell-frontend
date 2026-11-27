import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { ApiException } from '../../types/api'
import { getDefaultRouteForRole, isCustomerRole } from '../../types/auth'
import { Button } from '../ui/Button'

type LocationState = {
  from?: { pathname?: string }
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  )
}

export function GoogleSignInButton() {
  const { googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [clientError, setClientError] = useState('')

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()

  const googleMutation = useMutation({
    mutationFn: (idToken: string) => googleLogin({ idToken }),
    onSuccess: (auth) => {
      const fromPath = (location.state as LocationState | null)?.from?.pathname
      if (fromPath && isCustomerRole(auth.user.role)) {
        navigate(fromPath, { replace: true })
        return
      }
      navigate(getDefaultRouteForRole(auth.user.role), { replace: true })
    },
  })

  const errorMessage =
    clientError ||
    (googleMutation.error instanceof ApiException
      ? googleMutation.error.message
      : googleMutation.error
        ? 'Google sign-in failed. Please try again.'
        : '')

  if (!googleClientId) {
    return (
      <div className="space-y-2">
        {clientError && (
          <div className="rounded-xl border border-info-border bg-info-soft px-4 py-2.5 text-xs font-medium text-info-soft-foreground">
            {clientError}
          </div>
        )}
        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          leftIcon={<GoogleIcon />}
          onClick={() =>
            setClientError(
              'Add VITE_GOOGLE_CLIENT_ID to your .env file to enable Google Sign-In.'
            )
          }
        >
          Continue with Google
        </Button>
      </div>
    )
  }
return (
    <div className="space-y-2">
      {errorMessage && (
        <div className="rounded-xl border border-destructive-border bg-destructive-soft px-4 py-2.5 text-xs font-medium text-destructive-soft-foreground">
          {errorMessage}
        </div>
      )}

      <div className="relative overflow-hidden rounded-xl">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          isLoading={googleMutation.isPending}
          leftIcon={<GoogleIcon />}
          className="rounded-xl"
        >
          Continue with Google
        </Button>

        <div
          className={[
            'absolute inset-0 flex items-center justify-center opacity-0',
            googleMutation.isPending ? 'pointer-events-none' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <GoogleLogin
            size="large"
            width="400"
            onSuccess={(credentialResponse) => {
              setClientError('')
              if (!credentialResponse.credential) {
                setClientError('No Google credential token received.')
                return
              }
              googleMutation.mutate(credentialResponse.credential)
            }}
            onError={() => {
              setClientError('Google sign-in popup was cancelled or failed.')
            }}
          />
        </div>
      </div>
    </div>
  )
}