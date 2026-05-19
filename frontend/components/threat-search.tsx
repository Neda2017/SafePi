"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Download, AlertTriangle, Shield, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { scamDatabase } from "@/lib/scam-database"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ThreatSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"reports" | "date" | "alphabetical">("reports")

  // Get unique types from database
  const threatTypes = useMemo(() => {
    const types = new Set(scamDatabase.map((threat) => threat.type))
    return Array.from(types).sort()
  }, [])

  // Filter and sort threats
  const filteredThreats = useMemo(() => {
    let results = scamDatabase

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (threat) =>
          threat.url.toLowerCase().includes(query) ||
          threat.description.toLowerCase().includes(query) ||
          threat.type.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (selectedType !== "all") {
      results = results.filter((threat) => threat.type === selectedType)
    }

    // Severity filter
    if (selectedSeverity !== "all") {
      results = results.filter((threat) => threat.severity === selectedSeverity)
    }

    // Sort
    results = [...results].sort((a, b) => {
      if (sortBy === "reports") {
        return b.reports - a.reports
      }
      if (sortBy === "date") {
        return new Date(b.lastReported).getTime() - new Date(a.lastReported).getTime()
      }
      return a.url.localeCompare(b.url)
    })

    return results
  }, [searchQuery, selectedType, selectedSeverity, sortBy])

  const handleExport = () => {
    const csv = [
      ["URL", "Type", "Severity", "Description", "Reports", "Last Reported"],
      ...filteredThreats.map((threat) => [
        threat.url,
        threat.type,
        threat.severity,
        threat.description,
        threat.reports.toString(),
        threat.lastReported,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `safepi-threats-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Threat Database</h2>
            <p className="text-sm text-muted-foreground">
              Browse and search {scamDatabase.length.toLocaleString()} known threats
            </p>
          </div>
          <Button onClick={handleExport} variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search threats by URL, type, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {threatTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger>
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "reports" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("reports")}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Reports
            </Button>
            <Button
              variant={sortBy === "date" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("date")}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Recent
            </Button>
            <Button
              variant={sortBy === "alphabetical" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("alphabetical")}
            >
              A-Z
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredThreats.length.toLocaleString()} of {scamDatabase.length.toLocaleString()} threats
        </div>

        {/* Results List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredThreats.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No threats found matching your search</p>
            </div>
          ) : (
            filteredThreats.map((threat, index) => (
              <div
                key={`${threat.url}-${index}`}
                className="p-4 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={threat.severity === "critical" ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {threat.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {threat.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{threat.reports} reports</span>
                    </div>
                    <p className="text-sm font-mono text-foreground break-all mb-1">{threat.url}</p>
                    <p className="text-xs text-muted-foreground">{threat.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(threat.lastReported).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
