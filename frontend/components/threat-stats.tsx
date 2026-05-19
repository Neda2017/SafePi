"use client"

import { TrendingUp, Shield, AlertTriangle, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"

const stats = [
  {
    label: "Total Scans",
    value: "2.4M",
    change: "+12.5%",
    trend: "up",
    icon: Globe,
  },
  {
    label: "Threats Blocked",
    value: "18,247",
    change: "+8.3%",
    trend: "up",
    icon: Shield,
  },
  {
    label: "Active Threats",
    value: "1,429",
    change: "-5.2%",
    trend: "down",
    icon: AlertTriangle,
  },
  {
    label: "Detection Rate",
    value: "99.8%",
    change: "+0.2%",
    trend: "up",
    icon: TrendingUp,
  },
]

const threatTypes = [
  { type: "Phishing", count: 8234, percentage: 45 },
  { type: "Scam Sites", count: 5421, percentage: 30 },
  { type: "Fake Logins", count: 2738, percentage: 15 },
  { type: "Malware", count: 1854, percentage: 10 },
]

export function ThreatStats() {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-4 bg-card border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-xs font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          )
        })}
      </div>

      {/* Threat Breakdown */}
      <Card className="p-6 bg-card border-border">
        <h3 className="font-semibold text-foreground mb-4">Threat Breakdown</h3>
        <div className="space-y-4">
          {threatTypes.map((threat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{threat.type}</span>
                <span className="text-muted-foreground">{threat.count.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${threat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Protection Timeline */}
      <Card className="p-6 bg-card border-border">
        <h3 className="font-semibold text-foreground mb-4">Protection Timeline</h3>
        <div className="space-y-4">
          {[
            { time: "Today", scans: 12847, threats: 247 },
            { time: "Yesterday", scans: 11923, threats: 289 },
            { time: "This Week", scans: 84521, threats: 1847 },
            { time: "This Month", scans: 342156, threats: 7234 },
          ].map((period, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
            >
              <div>
                <div className="text-sm font-medium text-foreground">{period.time}</div>
                <div className="text-xs text-muted-foreground mt-1">{period.scans.toLocaleString()} scans</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-destructive">{period.threats}</div>
                <div className="text-xs text-muted-foreground">threats</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
