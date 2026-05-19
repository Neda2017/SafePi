"use client"

import { useState, useEffect } from "react"
import { Shield, TrendingUp, Users, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { analytics } from "@/lib/analytics"

export function RealtimeStats() {
  const [stats, setStats] = useState({
    totalScans: 0,
    threatsBlocked: 0,
    usersProtected: 0,
    dailyScans: 0,
  })

  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Load initial stats
    const initialStats = analytics.getStats()
    setStats(initialStats)

    // Update stats every 5 seconds
    const interval = setInterval(() => {
      const currentStats = analytics.getStats()
      
      // Check if stats changed
      if (
        currentStats.totalScans !== stats.totalScans ||
        currentStats.threatsBlocked !== stats.threatsBlocked ||
        currentStats.usersProtected !== stats.usersProtected
      ) {
        setIsAnimating(true)
        setStats(currentStats)
        
        setTimeout(() => setIsAnimating(false), 1000)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [stats])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const statItems = [
    {
      icon: Shield,
      label: "Total Scans",
      value: stats.totalScans,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Zap,
      label: "Threats Blocked",
      value: stats.threatsBlocked,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      icon: Users,
      label: "Users Protected",
      value: stats.usersProtected,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: TrendingUp,
      label: "Today's Scans",
      value: stats.dailyScans,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Live Protection Stats</h3>
          <p className="text-sm text-muted-foreground">Real-time security metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={`flex flex-col items-center text-center p-4 rounded-lg ${item.bgColor} transition-all duration-300 ${
              isAnimating ? "scale-105" : "scale-100"
            }`}
          >
            <item.icon className={`w-6 h-6 ${item.color} mb-2`} />
            <p className={`text-2xl font-bold ${item.color} mb-1`}>{formatNumber(item.value)}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          Updates every 5 seconds • Community-powered protection
        </p>
      </div>
    </Card>
  )
}
