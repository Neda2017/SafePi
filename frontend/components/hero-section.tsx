"use client"

import { Shield, Zap, Users, Clock } from "lucide-react"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [count, setCount] = useState(0)
  const targetCount = 1030

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = targetCount / steps
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep <= steps) {
        setCount(Math.floor(increment * currentStep))
      } else {
        setCount(targetCount)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative bg-gradient-to-br from-primary/5 via-blue-500/5 to-transparent border-b border-border overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Real-Time Protection</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
            Protect Your{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
              Pi Network
            </span>{" "}
            Assets
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
            Real-time detection of phishing sites, fake wallets, and scam attempts. Stay safe with community-powered
            threat intelligence.
          </p>

          {/* Animated threat counter */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border-2 border-border shadow-lg mb-12 animate-in fade-in slide-in-from-top-4 duration-700 delay-300">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Shield className="w-6 h-6 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
              </div>
              <div className="text-left">
                <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">{count.toLocaleString()}+</p>
                <p className="text-xs text-muted-foreground">Threats Blocked</p>
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Instant Scans</p>
                <p className="text-xs text-muted-foreground">Real-time detection</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Community Reports</p>
                <p className="text-xs text-muted-foreground">Crowdsourced safety</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Clock className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">24/7 Monitoring</p>
                <p className="text-xs text-muted-foreground">Always protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
