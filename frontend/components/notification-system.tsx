"use client"

import { useState, useEffect } from "react"
import { Bell, X, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Notification {
  id: string
  type: "warning" | "info" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load notifications from localStorage
    const saved = localStorage.getItem("notifications")
    if (saved) {
      const parsed = JSON.parse(saved)
      setNotifications(parsed)
      setUnreadCount(parsed.filter((n: Notification) => !n.read).length)
    }

    // Check for compromised sites
    checkForCompromisedSites()
  }, [])

  const checkForCompromisedSites = () => {
    // Get user's scan history
    const scanHistory = localStorage.getItem("scanHistory")
    if (!scanHistory) return

    try {
      const history = JSON.parse(scanHistory)
      const safeSites = history.filter((scan: any) => scan.result === "safe" || scan.result === "official")

      // Check if any previously safe sites are now compromised
      // (In production, this would check against updated threat database)
      const compromisedSites = safeSites.filter((scan: any) => {
        // Simulate checking against updated database
        // In production, check against real-time threat feeds
        return false
      })

      if (compromisedSites.length > 0) {
        compromisedSites.forEach((site: any) => {
          addNotification({
            type: "warning",
            title: "Security Alert",
            message: `A site you previously scanned (${site.url}) has been flagged as suspicious`,
          })
        })
      }
    } catch (error) {
      console.error("[v0] Error checking for compromised sites:", error)
    }
  }

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    }

    const updated = [newNotification, ...notifications].slice(0, 50)
    setNotifications(updated)
    setUnreadCount(updated.filter((n) => !n.read).length)
    localStorage.setItem("notifications", JSON.stringify(updated))
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(updated)
    setUnreadCount(updated.filter((n) => !n.read).length)
    localStorage.setItem("notifications", JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    setUnreadCount(0)
    localStorage.setItem("notifications", JSON.stringify(updated))
  }

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    setUnreadCount(updated.filter((n) => !n.read).length)
    localStorage.setItem("notifications", JSON.stringify(updated))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-success" />
      case "info":
        return <Info className="w-5 h-5 text-accent" />
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowPanel(!showPanel)}
        className="relative touch-manipulation"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {showPanel && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:absolute md:inset-auto md:top-full md:right-0 md:mt-2 md:bg-transparent md:backdrop-blur-none">
          <Card className="absolute inset-4 md:inset-auto md:w-96 max-h-[80vh] overflow-hidden flex flex-col bg-card border-border shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                    Mark all read
                  </Button>
                )}
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1 hover:bg-secondary rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/20 transition-colors ${
                        !notification.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-foreground">{notification.title}</h4>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-secondary rounded transition-colors shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-[10px] text-primary hover:underline"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
