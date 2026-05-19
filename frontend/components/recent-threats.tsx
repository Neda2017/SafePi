"use client"

import { Clock, AlertTriangle, ShieldAlert } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { scamDatabase } from "@/lib/scam-database"

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays <= 7) return `${diffDays} days ago`
  return formatDate(dateStr)
}

export function RecentThreats() {
  // Sort by lastReported date descending, deduplicate by base domain
  const getLatestThreats = () => {
    const seen = new Set<string>()
    return [...scamDatabase]
      .sort((a, b) => new Date(b.lastReported).getTime() - new Date(a.lastReported).getTime())
      .filter((threat) => {
        // Deduplicate: skip http duplicate if https already shown
        const base = threat.url.replace(/^https?:\/\//, "").replace(/^www\./, "")
        if (seen.has(base)) return false
        seen.add(base)
        return true
      })
      .slice(0, 6)
  }

  const latestThreats = getLatestThreats()

  return (
    <Card className="p-4 bg-card border-border overflow-hidden min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="w-4 h-4 text-destructive shrink-0" />
        <h4 className="font-semibold text-sm text-foreground">Latest Threats</h4>
        <Badge variant="secondary" className="text-xs ml-auto shrink-0 bg-destructive/10 text-destructive border-destructive/20">
          Live
        </Badge>
      </div>
      <div className="space-y-2">
        {latestThreats.map((threat, index) => (
          <div
            key={index}
            className="p-2 rounded-md bg-background border border-border hover:bg-secondary/50 transition-colors min-w-0"
          >
            <div className="flex items-start justify-between gap-2 mb-1 min-w-0">
              <p className="text-xs text-foreground font-medium flex-1 min-w-0 break-all">{threat.url}</p>
              <Badge
                variant="outline"
                className={`shrink-0 text-xs ${
                  threat.severity === "critical"
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : threat.severity === "high"
                      ? "bg-warning/10 text-warning border-warning/20"
                      : "bg-secondary text-muted-foreground border-border"
                }`}
              >
                {threat.type}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1 shrink-0">
                <AlertTriangle className="w-3 h-3" />
                {threat.reports} reports
              </span>
              <span className="shrink-0 font-medium text-primary/80">
                {getTimeAgo(threat.lastReported)}
              </span>
              <span className="shrink-0 text-muted-foreground/60">
                {formatDate(threat.lastReported)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
