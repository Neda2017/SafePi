"use client"

import { useState, useEffect } from "react"
import { BarChart3, Shield, TrendingUp, Clock, AlertTriangle, CheckCircle2, XCircle, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePiAuth } from "@/contexts/pi-auth-context"

interface ScanHistoryItem {
  url: string
  result: "safe" | "warning" | "danger" | "official"
  timestamp: string
  trustScore?: number
  isSafe?: boolean
}

export default function DashboardPage() {
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([])
  const [stats, setStats] = useState({
    totalScans: 0,
    threatsAvoided: 0,
    safeSitesVisited: 0,
    thisWeek: 0,
  })

  const { userData, piAccessToken } = usePiAuth()
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem("scanHistory")
    if (saved) {
      const history: ScanHistoryItem[] = JSON.parse(saved)
      setScanHistory(history)

      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      setStats({
        totalScans: history.length,
        threatsAvoided: history.filter((item) => item.result === "danger" || item.result === "warning").length,
        safeSitesVisited: history.filter((item) => item.result === "safe" || item.result === "official").length,
        thisWeek: history.filter((item) => new Date(item.timestamp) > oneWeekAgo).length,
      })
    }
  }, [])

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your scan history?")) {
      setScanHistory([])
      localStorage.removeItem("scanHistory")
      setStats({
        totalScans: 0,
        threatsAvoided: 0,
        safeSitesVisited: 0,
        thisWeek: 0,
      })
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case "official":
      case "safe":
        return <CheckCircle2 className="w-5 h-5 text-success" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />
      case "danger":
        return <XCircle className="w-5 h-5 text-destructive" />
      default:
        return <Shield className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getResultBadge = (result: string) => {
    const styles = {
      official: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      safe: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      danger: "bg-destructive/10 text-destructive border-destructive/20",
    }
    return styles[result as keyof typeof styles] || "bg-muted/10 text-muted-foreground border-muted/20"
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Safe<span className="text-primary">π</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              {userData && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{userData.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">@{userData.username}</span>
                </div>
              )}
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Scanner
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {userData ? `${userData.username}'s Security Dashboard` : "Your Security Dashboard"}
            </h1>
            <p className="text-muted-foreground">Track your scanning activity and stay protected</p>
          </div>
          {userData && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm font-semibold text-success">Pi Network Verified</p>
                <p className="text-xs text-muted-foreground">Enhanced protection enabled</p>
              </div>
            </div>
          )}
        </div>

        {userData && (
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Enhanced verification active</p>
                <p className="text-xs text-muted-foreground">
                  Wallet addresses are verified against Pi Network blockchain for maximum security
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Scans</h3>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.totalScans}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Threats Avoided</h3>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.threatsAvoided}</div>
            <p className="text-xs text-muted-foreground mt-1">Dangerous sites blocked</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Safe Sites</h3>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.safeSitesVisited}</div>
            <p className="text-xs text-muted-foreground mt-1">Verified safe</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">This Week</h3>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Recent Scans</h2>
            </div>
            {scanHistory.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearHistory}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No scans yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start scanning URLs to see your history here</p>
              <Button onClick={() => router.push("/")}>Start Scanning</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {scanHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getResultIcon(item.result)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.url}</p>
                      <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.trustScore !== undefined && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{item.trustScore}/100</p>
                        <p className="text-xs text-muted-foreground">Trust Score</p>
                      </div>
                    )}
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getResultBadge(item.result)}`}>
                      {item.result.charAt(0).toUpperCase() + item.result.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
