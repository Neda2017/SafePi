/**
 * Auth persistence helper.
 * Stores Pi auth state in sessionStorage so it survives in-app navigation
 * without requiring a full SDK re-initialisation on every route change.
 */

const AUTH_KEY = "safepi_auth_state"

export interface PersistedAuthState {
  isAuthenticated: boolean
  accessToken: string | null
  username: string | null
  timestamp: number
}

/** Maximum session age: 4 hours */
const SESSION_TTL_MS = 4 * 60 * 60 * 1000

export function saveAuthState(state: PersistedAuthState): void {
  try {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({ ...state, timestamp: Date.now() }))
  } catch {
    // sessionStorage not available (SSR / private mode)
  }
}

export function loadAuthState(): PersistedAuthState | null {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed: PersistedAuthState = JSON.parse(raw)
    // Invalidate stale sessions
    if (Date.now() - parsed.timestamp > SESSION_TTL_MS) {
      sessionStorage.removeItem(AUTH_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearAuthState(): void {
  try {
    sessionStorage.removeItem(AUTH_KEY)
  } catch {
    // ignore
  }
}
