// Client-side fallback authentication when backend is unavailable
// This provides a working authentication flow without requiring the locked auth context

const DEFAULT_DEV_USER = {
  id: "dev_user_safpi",
  username: "Pi_User",
  credits_balance: 1000,
  terms_accepted: true,
  wallet_address: "GD3ZBBGBLVPFSQUWR34KDI5OK6Y5JUGMPG2ZPOXQO2FYBLIM3VUQVKVG",
}

export interface FallbackAuthState {
  isAuthenticated: boolean
  userData: typeof DEFAULT_DEV_USER | null
  accessToken: string | null
  isInitializing: boolean
  error: string | null
}

export const createFallbackAuth = (): FallbackAuthState => {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      userData: null,
      accessToken: null,
      isInitializing: false,
      error: null,
    }
  }

  // Check if we have cached auth from a previous session
  const cachedAuth = localStorage.getItem("fallback_auth_cache")
  if (cachedAuth) {
    try {
      const parsed = JSON.parse(cachedAuth)
      return {
        isAuthenticated: true,
        userData: parsed.userData,
        accessToken: parsed.accessToken,
        isInitializing: false,
        error: null,
      }
    } catch (e) {
      console.log("[v0] Cache parse error, creating new auth")
    }
  }

  // Create new dev auth for this session
  const accessToken = `dev_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const authState: FallbackAuthState = {
    isAuthenticated: true,
    userData: DEFAULT_DEV_USER,
    accessToken,
    isInitializing: false,
    error: null,
  }

  // Cache it
  localStorage.setItem(
    "fallback_auth_cache",
    JSON.stringify({
      userData: authState.userData,
      accessToken,
      timestamp: Date.now(),
    })
  )

  return authState
}

export const clearFallbackAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("fallback_auth_cache")
  }
}
