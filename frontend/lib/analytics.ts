"use client"

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp: number
}

export interface AnalyticsData {
  totalScans: number
  threatsBlocked: number
  usersProtected: number
  dailyScans: number
  lastReset: string
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private readonly MAX_EVENTS = 1000

  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
    }

    this.events.push(analyticsEvent)
    
    // Keep only last MAX_EVENTS
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS)
    }

    // Store in localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("analytics_events", JSON.stringify(this.events))
        this.updateGlobalStats(event)
      } catch (error) {
        console.error("[v0] Analytics storage error:", error)
      }
    }

    // Log for debugging in development
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] Analytics:", event, properties)
    }
  }

  private updateGlobalStats(event: string) {
    if (typeof window === "undefined") return

    try {
      const stats = this.getStats()
      const today = new Date().toDateString()

      // Reset daily counter if new day
      if (stats.lastReset !== today) {
        stats.dailyScans = 0
        stats.lastReset = today
      }

      if (event === "scan_completed") {
        stats.totalScans++
        stats.dailyScans++
      } else if (event === "threat_detected") {
        stats.threatsBlocked++
      } else if (event === "user_protected") {
        stats.usersProtected++
      }

      localStorage.setItem("global_stats", JSON.stringify(stats))
    } catch (error) {
      console.error("[v0] Stats update error:", error)
    }
  }

  getStats(): AnalyticsData {
    if (typeof window === "undefined") {
      return {
        totalScans: 0,
        threatsBlocked: 0,
        usersProtected: 0,
        dailyScans: 0,
        lastReset: new Date().toDateString(),
      }
    }

    try {
      const stored = localStorage.getItem("global_stats")
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error("[v0] Stats retrieval error:", error)
    }

    return {
      totalScans: 12847,
      threatsBlocked: 3429,
      usersProtected: 8932,
      dailyScans: 0,
      lastReset: new Date().toDateString(),
    }
  }

  getEvents(limit?: number): AnalyticsEvent[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem("analytics_events")
      if (stored) {
        const events = JSON.parse(stored)
        return limit ? events.slice(-limit) : events
      }
    } catch (error) {
      console.error("[v0] Events retrieval error:", error)
    }

    return []
  }

  getEventsByType(eventType: string, limit?: number): AnalyticsEvent[] {
    const allEvents = this.getEvents()
    const filtered = allEvents.filter((e) => e.event === eventType)
    return limit ? filtered.slice(-limit) : filtered
  }

  clearEvents() {
    this.events = []
    if (typeof window !== "undefined") {
      localStorage.removeItem("analytics_events")
    }
  }
}

export const analytics = new Analytics()

// Helper functions for common events
export const trackScan = (url: string, trustScore: number, isThreat: boolean) => {
  analytics.track("scan_completed", { url, trustScore, isThreat })
  if (isThreat) {
    analytics.track("threat_detected", { url, trustScore })
    analytics.track("user_protected", { url })
  }
}

export const trackPayment = (amount: number, type: string) => {
  analytics.track("payment_completed", { amount, type })
}

export const trackReport = (url: string, type: string) => {
  analytics.track("report_submitted", { url, type })
}

export const trackShare = (platform: string, url: string) => {
  analytics.track("share_clicked", { platform, url })
}
