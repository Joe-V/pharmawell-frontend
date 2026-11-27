import { useCallback, useEffect, useReducer, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { authStorage, UNAUTHORIZED_EVENT } from '../lib/authStorage'
import { AuthContext, type AuthState } from './authContext'
import type {
  AuthResponse,
  AuthUser,
  GoogleLoginRequest,
  LoginRequest,
  VerifyEmailRequest,
} from '../types/auth'

type AuthAction =
  | { type: 'SET_AUTH'; payload: AuthUser }
  | { type: 'LOGOUT' }

function getInitialState(): AuthState {
  const session = authStorage.getSession()
  return {
    user: session?.user ?? null,
    isAuthenticated: Boolean(session),
  }
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        user: action.payload,
        isAuthenticated: true,
      }
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, undefined, getInitialState)
  const queryClient = useQueryClient()

 const applyAuthSession = useCallback(
    (auth: AuthResponse, rememberMe?: boolean) => {
      authStorage.setSession(auth, rememberMe)
      dispatch({ type: 'SET_AUTH', payload: auth.user })
    },
    []
  )

  const login = useCallback(
    async (payload: LoginRequest, rememberMe = true) => {
      const response = await authApi.login(payload)
      applyAuthSession(response, rememberMe)
      return response
    },
    [applyAuthSession]
  )

  const verifyEmail = useCallback(
    async (payload: VerifyEmailRequest) => {
      const response = await authApi.verifyEmail(payload)
      applyAuthSession(response)
      return response
    },
    [applyAuthSession]
  )

  const googleLogin = useCallback(
    async (payload: GoogleLoginRequest) => {
      const response = await authApi.googleLogin(payload)
      applyAuthSession(response)
      return response
    },
    [applyAuthSession]
  )

  const refreshUser = useCallback(async () => {
    const freshUser = await authApi.getMe()
    authStorage.setUser(freshUser)
    dispatch({ type: 'SET_AUTH', payload: freshUser })
    return freshUser
  }, [])

  const logout = useCallback(async () => {
    try {
      if (authStorage.getAccessToken()) {
        await authApi.logout()
      }
    } catch {
      // Always clear local session even if server token already expired
    } finally {
      authStorage.clear()
      queryClient.clear()
      dispatch({ type: 'LOGOUT' })
    }
  }, [queryClient])

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.clear()
      dispatch({ type: 'LOGOUT' })
    }

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    }
  }, [queryClient])

  useEffect(() => {
    if (!authStorage.getSession()) return

    authApi
      .getMe()
      .then((freshUser) => {
        authStorage.setUser(freshUser)
        dispatch({ type: 'SET_AUTH', payload: freshUser })
      })
      .catch(() => {
        
            })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        verifyEmail,
        googleLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}