"use client"

import { useEffect, useState } from "react"
import { Shield, Users, TrendingUp, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

export function LiveStats() {
  const [stats, setStats] = useState({
    usersProtected: 0,
    threatsBlocked: 0,
    scansToday: 0,
  })

  useEffect(() => {
    // Simulate live counter updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        usersProtected: Math.min(prev.usersProtected + Math.floor(Math.random() * 3), 50000),
        threatsBlocked: Math.min(prev.threatsBlocked + Math.floor(Math.random() * 5), 1100),
        scansToday: Math.min(prev.scansToday + Math.floor(Math.random() * 10), 25000),
      }))
    }, 3000)

    // Initialize with base values
    setStats({
      usersProtected: 47823 + Math.floor(Math.random() * 100),
      threatsBlocked: 1087 + Math.floor(Math.random() * 10),
      scansToday: 23456 + Math.floor(Math.random() * 500),
    })

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/20">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{stats.usersProtected.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Users Protected</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-destructive/20">
            <Shield className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{stats.threatsBlocked.toLocaleString()}+</p>
            <p className="text-xs text-muted-foreground">Threats Blocked</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-accent/20">
            <TrendingUp className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{stats.scansToday.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Scans Today</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
