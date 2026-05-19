"use client"

import { useState, useEffect } from "react"
import { Shield, X, CheckCircle2, AlertTriangle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Small delay to ensure smooth animation
    const timer = setTimeout(() => {
      const hasSeenWelcome = localStorage.getItem("safepi-welcome-seen")
      if (!hasSeenWelcome) {
        setIsVisible(true)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem("safepi-welcome-seen", "true")
  }

  const handleGetStarted = () => {
    handleClose()
    // Scroll to scanner section
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="max-w-lg w-full bg-card border-2 border-primary/20 shadow-2xl">
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 hover:bg-secondary rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                <Shield className="w-12 h-12 text-primary relative z-10" />
              </div>
            </div>

            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold text-foreground">Welcome to Safeπ</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A verification search engine for Pi Network users to check links, domains, and wallet addresses to prevent scams.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                <CheckCircle2 className="w-6 h-6 text-success mb-1.5" />
                <h3 className="text-xs font-semibold text-foreground mb-0.5">Real-Time</h3>
                <p className="text-[10px] text-muted-foreground">Instant verification</p>
              </div>

              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                <AlertTriangle className="w-6 h-6 text-warning mb-1.5" />
                <h3 className="text-xs font-semibold text-foreground mb-0.5">Community</h3>
                <p className="text-[10px] text-muted-foreground">Crowdsourced data</p>
              </div>

              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Lock className="w-6 h-6 text-accent mb-1.5" />
                <h3 className="text-xs font-semibold text-foreground mb-0.5">Protected</h3>
                <p className="text-[10px] text-muted-foreground">Safe verification</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 py-3 border-t border-border">
              <div className="text-center">
                <p className="text-xl font-bold text-primary">1,100+</p>
                <p className="text-[10px] text-muted-foreground">Threats</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-accent">24/7</p>
                <p className="text-[10px] text-muted-foreground">Protection</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-success">Free</p>
                <p className="text-[10px] text-muted-foreground">Always</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleGetStarted} size="sm" className="flex-1">
                Get Started
              </Button>
              <Button onClick={handleClose} variant="outline" size="sm" className="flex-1 bg-transparent">
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
