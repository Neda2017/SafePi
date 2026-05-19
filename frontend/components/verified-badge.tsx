"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Shield, Award } from "lucide-react"
import type { VerifiedSite } from "@/lib/verified-sites"

interface VerifiedBadgeProps {
  site: VerifiedSite
  size?: "sm" | "md" | "lg"
}

export function VerifiedBadge({ site, size = "md" }: VerifiedBadgeProps) {
  const getBadgeColor = (level: VerifiedSite["badgeLevel"]) => {
    switch (level) {
      case "gold":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
      case "silver":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
      case "bronze":
        return "bg-gradient-to-r from-amber-600 to-amber-700 text-white"
    }
  }

  const getIcon = (level: VerifiedSite["badgeLevel"]) => {
    const iconSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
    
    switch (level) {
      case "gold":
        return <Shield className={iconSize} />
      case "silver":
        return <CheckCircle2 className={iconSize} />
      case "bronze":
        return <Award className={iconSize} />
    }
  }

  const badgeSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"

  return (
    <Badge className={`${getBadgeColor(site.badgeLevel)} ${badgeSize} gap-1 px-2 py-1`}>
      {getIcon(site.badgeLevel)}
      <span className="font-semibold">Verified {site.badgeLevel === "gold" ? "Official" : site.category}</span>
    </Badge>
  )
}

interface VerifiedIndicatorProps {
  site: VerifiedSite
}

export function VerifiedIndicator({ site }: VerifiedIndicatorProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10 border border-success">
      <Shield className="w-6 h-6 text-success shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-semibold text-foreground">{site.name}</h3>
          <VerifiedBadge site={site} size="sm" />
        </div>
        <p className="text-xs text-muted-foreground mb-2">{site.description}</p>
        <p className="text-xs text-success font-medium">
          This site is verified and safe to use
        </p>
      </div>
    </div>
  )
}
