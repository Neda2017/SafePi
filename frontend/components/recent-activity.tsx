"use client"

import { useEffect, useState } from "react"
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Activity {
  id: string
  type: "scan" | "report" | "block"
  location: string
  timestamp: Date
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  const locations = ["New York", "London", "Tokyo", "Paris", "Sydney", "Dubai", "Singapore", "Berlin", "Toronto", "Mumbai"]

  useEffect(() => {
    // Initialize with some activities
    const initial: Activity[] = Array.from({ length: 5 }, (_, i) => ({
      id: `activity-${i}`,
      type: ["scan", "report", "block"][Math.floor(Math.random() * 3)] as Activity["type"],
      location: locations[Math.floor(Math.random() * locations.length)],
      timestamp: new Date(Date.now() - Math.random() * 300000),
    }))
    setActivities(initial)

    // Add new activity every 5 seconds
    const interval = setInterval(() => {
      const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        type: ["scan", "report", "block"][Math.floor(Math.random() * 3)] as Activity["type"],
        location: locations[Math.floor(Math.random() * locations.length)],
        timestamp: new Date(),
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "scan":
        return <Shield className="w-4 h-4 text-primary" />
      case "report":
        return <AlertTriangle className="w-4 h-4 text-warning" />
      case "block":
        return <CheckCircle2 className="w-4 h-4 text-success" />
    }
  }

  const getActivityText = (type: Activity["type"]) => {
    switch (type) {
      case "scan":
        return "URL scanned"
      case "report":
        return "Threat reported"
      case "block":
        return "Scam blocked"
    }
  }

  const getRelativeTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <h3 className="text-sm font-semibold text-foreground">Live Activity</h3>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="p-1.5 rounded-md bg-secondary">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{getActivityText(activity.type)}</p>
              <p className="text-xs text-muted-foreground">{activity.location}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{getRelativeTime(activity.timestamp)}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
