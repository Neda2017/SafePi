"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { loadAuthState } from "@/lib/auth-persistence"
import { Shield } from "lucide-react"

/**
 * NavigationGuard prevents the white screen on back-navigation.
 * When the Pi SDK is re-initialising, it shows a lightweight branded
 * loading screen instead of a blank white page, then redirects once
 * the persisted session is confirmed valid.
 */
export function NavigationGuard() {
  const [showGuard, setShowGuard] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // On navigation back to "/", check if we have a valid persisted session
    // If yes, show a brief branded loader while AppWrapper re-authenticates
    if (pathname === "/") {
      const persisted = loadAuthState()
      if (persisted?.isAuthenticated) {
        setShowGuard(true)
        // Hide guard after a short delay — AppWrapper should have re-authenticated by then
        const timer = setTimeout(() => setShowGuard(false), 1800)
        return () => clearTimeout(timer)
      }
    }
  }, [pathname])

  if (!showGuard) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background animate-in fade-in duration-200">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <Shield className="absolute inset-0 m-auto w-7 h-7 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Safeπ</p>
          <p className="text-sm text-muted-foreground mt-1">Resuming session...</p>
        </div>
      </div>
    </div>
  )
}
