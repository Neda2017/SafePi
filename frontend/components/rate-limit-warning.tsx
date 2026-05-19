"use client"

import { AlertTriangle, Clock, ShieldAlert } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RateLimitWarningProps {
  remaining: number
  resetIn: number
  blocked: boolean
  suspicious: boolean
  maxRequests: number
  onUpgrade?: () => void
}

export function RateLimitWarning({
  remaining,
  resetIn,
  blocked,
  suspicious,
  maxRequests,
  onUpgrade,
}: RateLimitWarningProps) {
  const resetInMinutes = Math.ceil(resetIn / (60 * 1000))
  const resetInSeconds = Math.ceil(resetIn / 1000)

  if (blocked) {
    return (
      <Card className="p-6 bg-destructive/10 border-destructive/20 mb-6">
        <div className="flex items-start gap-4">
          <ShieldAlert className="w-8 h-8 text-destructive flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-destructive mb-2">Rate Limit Exceeded</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You have exceeded the maximum number of scans allowed. Please wait {resetInMinutes} minute
              {resetInMinutes !== 1 ? "s" : ""} before trying again, or upgrade to get unlimited scans.
            </p>
            {onUpgrade && (
              <Button onClick={onUpgrade} size="sm" variant="destructive">
                Get Daily Pass - Unlimited Scans
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  if (suspicious || remaining <= 2) {
    return (
      <Card className="p-4 bg-warning/10 border-warning/20 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">
              {suspicious ? "High Activity Detected" : `${remaining} Scan${remaining !== 1 ? "s" : ""} Remaining`}
            </h4>
            <p className="text-xs text-muted-foreground">
              {suspicious
                ? "You're approaching the rate limit. Consider slowing down or upgrading for unlimited access."
                : `Rate limit resets in ${resetInSeconds} second${resetInSeconds !== 1 ? "s" : ""}.`}
            </p>
            {onUpgrade && (
              <Button onClick={onUpgrade} size="sm" variant="outline" className="mt-3 bg-transparent">
                Upgrade for Unlimited
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  // Show info when user has used more than half
  if (remaining < maxRequests / 2) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 px-2">
        <Clock className="w-3 h-3" />
        <span>
          {remaining} of {maxRequests} free scans remaining
        </span>
      </div>
    )
  }

  return null
}
