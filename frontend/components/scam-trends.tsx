"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Calendar, AlertTriangle, BarChart3 } from "lucide-react"
import { scamDatabase } from "@/lib/scam-database"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from "recharts"

// Bright orange color for better visibility
const CHART_COLOR = "#ff6b35"

export function ScamTrends() {
  // Calculate trending scam types
  const scamTypeCount = scamDatabase.reduce(
    (acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const trendingScams = Object.entries(scamTypeCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([type, count]) => ({
      type: type.length > 15 ? type.substring(0, 15) + "..." : type,
      count,
    }))

  // Calculate activity over time (simulated based on lastReported)
  const timeRanges = ["24h", "7d", "14d", "30d"]
  const activityData = timeRanges.map((range) => {
    let count = 0
    scamDatabase.forEach((entry) => {
      if (range === "24h" && (entry.lastReported.includes("hour") || entry.lastReported.includes("minute"))) {
        count++
      } else if (range === "7d" && (entry.lastReported.includes("hour") || entry.lastReported.includes("day"))) {
        const days = Number.parseInt(entry.lastReported)
        if (!isNaN(days) && days <= 7) count++
      } else if (range === "14d") {
        const days = Number.parseInt(entry.lastReported)
        if (!isNaN(days) && days <= 14) count++
      } else if (range === "30d") {
        count++
      }
    })
    return { range, count }
  })

  // Calculate severity trends
  const severityCount = scamDatabase.reduce(
    (acc, entry) => {
      acc[entry.severity] = (acc[entry.severity] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const severityData = Object.entries(severityCount).map(([severity, count]) => ({
    severity: severity.charAt(0).toUpperCase() + severity.slice(1),
    count,
  }))

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-foreground">Most Active Scam Types</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendingScams}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLOR} opacity={0.2} />
            <XAxis dataKey="type" stroke={CHART_COLOR} fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke={CHART_COLOR} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill={CHART_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-foreground">Threat Activity Timeline</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLOR} opacity={0.2} />
            <XAxis dataKey="range" stroke={CHART_COLOR} fontSize={12} />
            <YAxis stroke={CHART_COLOR} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={CHART_COLOR}
              strokeWidth={3}
              dot={{ r: 5, fill: CHART_COLOR, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-foreground">Severity Distribution</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={severityData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLOR} opacity={0.2} />
            <XAxis type="number" stroke={CHART_COLOR} fontSize={12} />
            <YAxis dataKey="severity" type="category" stroke={CHART_COLOR} fontSize={12} width={80} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill={CHART_COLOR} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Trending Insights</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-background border border-border">
            <TrendingUp className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground mb-1">Most Active Threat</p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-orange-500">{trendingScams[0]?.type}</span> with{" "}
                {trendingScams[0]?.count} reported sites
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-background border border-border">
            <Calendar className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground mb-1">Recent Activity</p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-orange-500">{activityData[0]?.count}</span> new threats detected in
                the last 24 hours
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-background border border-border">
            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground mb-1">High Priority</p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-orange-500">{severityCount.critical || 0}</span> critical severity
                threats require immediate attention
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
