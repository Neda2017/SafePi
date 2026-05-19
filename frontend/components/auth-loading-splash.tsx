"use client"

import { useEffect, useState } from "react"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthLoadingSplashProps {
  message?: string
  timeoutMs?: number
  onTimeout?: () => void
}

export function AuthLoadingSplash({
  message = "Authenticating with Pi Network...",
  timeoutMs = 8000,
  onTimeout,
}: AuthLoadingSplashProps) {
  const [elapsed, setElapsed] = useState(0)
  const [isTimeout, setIsTimeout] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 100
        if (next >= timeoutMs) {
          setIsTimeout(true)
          onTimeout?.()
          clearInterval(timer)
          return next
        }
        return next
      })
    }, 100)

    return () => clearInterval(timer)
  }, [timeoutMs, onTimeout])

  const progress = (elapsed / timeoutMs) * 100

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>

        <div className="text-center max-w-sm">
          <h2 className="text-xl font-bold text-foreground mb-2">Safeπ</h2>
          <p className="text-sm text-muted-foreground mb-4">{message}</p>

          {isTimeout ? (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">Authentication Timeout</span>
              </div>
              <p className="text-xs text-destructive/80">
                The authentication service took too long to respond. This may happen if you&apos;re using Pi Browser
                and the Pi Network SDK is unavailable.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-destructive hover:bg-destructive/90"
                  size="sm"
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Try Again
                </Button>
                <p className="text-xs text-muted-foreground">
                  If this persists, ensure you&apos;re using Pi Browser to use the app.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden mx-auto">
                <div
                  className="h-full bg-primary transition-all duration-100"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground/50">
          Powered by Safeπ • Real-Time Scam Detection
        </div>
      </div>
    </div>
  )
}
