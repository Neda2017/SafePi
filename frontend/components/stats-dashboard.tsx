"use client"

import { Card } from "@/components/ui/card"
import { Database, PieChart, Activity, Info, CheckCircle } from "lucide-react"
import { scamDatabase } from "@/lib/scam-database"

interface StatsDashboardProps {
  databaseThreats: number
  verifiedSites: number
}

export function StatsDashboard({ databaseThreats, verifiedSites }: StatsDashboardProps) {
  const threatBreakdown = scamDatabase.reduce(
    (acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topThreats = Object.entries(threatBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const highSeverityCount = scamDatabase.filter((entry) => entry.severity === "high").length
  const mediumSeverityCount = scamDatabase.filter((entry) => entry.severity === "medium").length

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Database Statistics</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Database className="w-4 h-4" />
              <span>Known Threats</span>
            </div>
            <p className="text-2xl font-bold text-orange-500">{databaseThreats}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Verified Sites</span>
            </div>
            <p className="text-2xl font-bold text-orange-500">{verifiedSites}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-foreground">Threat Breakdown</h3>
        </div>
        <div className="space-y-3">
          {topThreats.map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{type}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                    style={{ width: `${(count / databaseThreats) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-foreground">Severity Analysis</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">High Severity</span>
              <span className="text-lg font-bold text-rose-500">{highSeverityCount}</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full"
                style={{ width: `${(highSeverityCount / databaseThreats) * 100}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Medium Severity</span>
              <span className="text-lg font-bold text-amber-500">{mediumSeverityCount}</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                style={{ width: `${(mediumSeverityCount / databaseThreats) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Protection Insights</h3>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <p>
              Our database contains{" "}
              <span className="font-semibold text-foreground">{databaseThreats} verified scam sites</span> targeting Pi
              Network users
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <p>
              Most common threats: <span className="font-semibold text-foreground">{topThreats[0]?.[0] || "N/A"}</span>{" "}
              with {topThreats[0]?.[1] || 0} reported sites
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <p>
              <span className="font-semibold text-foreground">{highSeverityCount}</span> high-severity threats require
              immediate attention
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
