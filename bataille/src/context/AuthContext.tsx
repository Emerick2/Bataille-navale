import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { PlayerHeaders } from './PlayerContext'

export type AuthUser = {
  id: number
  email: string
  profilePicture: string | null
}

export type AuthSession = {
  token: string
  user: AuthUser
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

type AuthState =
  | { status: 'loading' | 'anonymous'; session: null }
  | { status: 'authenticated'; session: AuthSession }

type AuthContextValue = {
  session: AuthSession | null
  user: AuthUser | null
  token: string | null
  status: AuthStatus
  isAuthenticated: boolean
  login: (session: AuthSession) => void
  logout: () => void
  getAuthorizationHeaders: () => PlayerHeaders | null
}

const SESSION_STORAGE_KEY = 'bataille-navale.auth-session'

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null) return false

  const user = value as Record<string, unknown>
  return (
    typeof user.id === 'number' &&
    Number.isInteger(user.id) &&
    user.id > 0 &&
    typeof user.email === 'string' &&
    user.email.trim().length > 0 &&
    (typeof user.profilePicture === 'string' || user.profilePicture === null)
  )
}

export function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) return false

  const session = value as Record<string, unknown>
  return typeof session.token === 'string' && session.token.length > 0 && isAuthUser(session.user)
}

function restoreSession(): AuthSession | null {
  try {
    const storedSession = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (storedSession === null) return null

    const parsedSession: unknown = JSON.parse(storedSession)
    if (isAuthSession(parsedSession)) return parsedSession
  } catch {
    // Invalid JSON or unavailable storage is treated as an anonymous session.
  }

  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // The in-memory state can still continue as anonymous if storage is unavailable.
  }
  return null
}

export const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  token: null,
  status: 'loading',
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  getAuthorizationHeaders: () => null,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({ status: 'loading', session: null })

  useEffect(() => {
    const session = restoreSession()
    setAuthState(
      session
        ? { status: 'authenticated', session }
        : { status: 'anonymous', session: null },
    )
  }, [])

  const login = (session: AuthSession) => {
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    } catch {
      // Keep the authenticated state for this page even if storage is unavailable.
    }
    setAuthState({ status: 'authenticated', session })
  }

  const logout = () => {
    try {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // Clear the in-memory session even if storage is unavailable.
    }
    setAuthState({ status: 'anonymous', session: null })
  }

  const session = authState.session
  const user = session?.user ?? null
  const token = session?.token ?? null
  const getAuthorizationHeaders = (): PlayerHeaders | null =>
    token === null ? null : { Authorization: `Bearer ${token}` }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        token,
        status: authState.status,
        isAuthenticated: authState.status === 'authenticated',
        login,
        logout,
        getAuthorizationHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}