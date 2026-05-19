"use client"

import { useState } from "react"
import { Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { scamDatabase } from "@/lib/scam-database"

export function AdvancedSearch() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [severity, setSeverity] = useState("all")
  const [results, setResults] = useState<typeof scamDatabase>([])

  const handleSearch = () => {
    let filtered = scamDatabase

    if (query) {
      const queryLower = query.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.url.toLowerCase().includes(queryLower) ||
          entry.description.toLowerCase().includes(queryLower) ||
          entry.type.toLowerCase().includes(queryLower),
      )
    }

    if (category !== "all") {
      filtered = filtered.filter((entry) => entry.type === category)
    }

    if (severity !== "all") {
      filtered = filtered.filter((entry) => entry.severity === severity)
    }

    setResults(filtered)
  }

  const exportResults = () => {
    const csv = [
      ["URL", "Type", "Severity", "Reports", "Description"].join(","),
      ...results.map((r) => [r.url, r.type, r.severity, r.reports, `"${r.description}"`].join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `safepi-search-results-${Date.now()}.csv`
    a.click()
  }

  const categories = Array.from(new Set(scamDatabase.map((e) => e.type)))

  return (
    <Card className="p-6 bg-slate-900/50 border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Advanced Search</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search URLs, descriptions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch} className="bg-cyan-600 hover:bg-cyan-700">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>

          {results.length > 0 && (
            <Button onClick={exportResults} variant="outline" className="border-slate-700 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export ({results.length})
            </Button>
          )}
        </div>

        {results.length > 0 && (
          <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
            {results.map((result, idx) => (
              <div key={idx} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white font-mono truncate flex-1">{result.url}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      result.severity === "critical"
                        ? "bg-red-500/20 text-red-400"
                        : result.severity === "high"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {result.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {result.type} • {result.reports} reports
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
