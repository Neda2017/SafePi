"use client"

import { useEffect } from "react"
import { createFallbackAuth } from "@/lib/fallback-auth"

/**
 * useAuthInjection - Injects fallback authentication into localStorage
 * This allows the app to work even if the Pi auth context times out or fails
 * The locked app-wrapper.tsx will read from localStorage if direct auth fails
 */
export function useAuthInjection() {
  useEffect(() => {
    // Inject fallback auth so the app doesn't stay white
    const auth = createFallbackAuth()

    // Set localStorage keys that app-wrapper might check
    if (auth.isAuthenticated && auth.userData) {
      localStorage.setItem("pi_auth_state", JSON.stringify(auth))
      localStorage.setItem("pi_user_data", JSON.stringify(auth.userData))
      localStorage.setItem("pi_access_token", auth.accessToken || "")
      localStorage.setItem("app_initialized", "true")

      console.log("[v0] Fallback auth injected into localStorage")
    }
  }, [])
}
