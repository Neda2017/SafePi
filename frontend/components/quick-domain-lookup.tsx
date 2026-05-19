"use client"

import { useState } from "react"
import { Search, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { scamDatabase } from "@/lib/scam-database"

export function QuickDomainLookup() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState<"found" | "safe" | null>(null)

  const handleQuickSearch = () => {
    if (!searchQuery.trim()) return

    const normalizedQuery = searchQuery
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
    const found = scamDatabase.some(
      (scam) =>
        scam.url.toLowerCase().includes(normalizedQuery) ||
        normalizedQuery.includes(
          scam.url
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, ""),
        ),
    )

    setSearchResult(found ? "found" : "safe")
  }

  return (
    <Card className="p-4 bg-card border-border overflow-hidden min-w-0">
      <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-primary" />
        Quick Domain Lookup
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        Check if a domain is in our database of {scamDatabase.length} known threats
      </p>
      <div className="flex gap-2 min-w-0">
        <input
          type="text"
          placeholder="Enter domain..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setSearchResult(null)
          }}
          onKeyDown={(e) => e.key === "Enter" && handleQuickSearch()}
          className="flex-1 min-w-0 h-9 px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button size="sm" onClick={handleQuickSearch} disabled={!searchQuery.trim()} className="shrink-0">
          Check
        </Button>
      </div>
      {searchResult && (
        <div
          className={`mt-3 p-2 rounded-md flex items-center gap-2 text-sm ${
            searchResult === "found" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
          }`}
        >
          {searchResult === "found" ? (
            <>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="min-w-0">Found in database - This is a known scam!</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="min-w-0">Not in our database - Proceed with caution</span>
            </>
          )}
        </div>
      )}
    </Card>
  )
}
