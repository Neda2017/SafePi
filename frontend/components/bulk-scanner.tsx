"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, BadgeCheck, Loader2, FileText } from "lucide-react"
import { calculateTrustScore } from "@/lib/trust-score"
import { safeSites } from "@/lib/safe-sites"
import { scamDatabase } from "@/lib/scam-database"

interface BulkResult {
  url: string
  trustScore: number
  level: string
  status: "official" | "safe" | "warning" | "danger"
}

export function BulkScanner() {
  const [urls, setUrls] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState<BulkResult[]>([])

  const handleBulkScan = async () => {
    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)

    if (urlList.length === 0) return

    setIsScanning(true)
    setResults([])

    for (let i = 0; i < urlList.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const url = urlList[i]
      const normalizedUrl = url
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "")

      const isOfficial = safeSites.some(
        (site) => normalizedUrl.includes(site.url.toLowerCase()) || site.url.toLowerCase().includes(normalizedUrl),
      )

      const isScam = scamDatabase.some(
        (scam) =>
          scam.url.toLowerCase().includes(normalizedUrl) ||
          normalizedUrl.includes(
            scam.url
              .toLowerCase()
              .replace(/^https?:\/\//, "")
              .replace(/\/$/, ""),
          ),
      )

      let status: BulkResult["status"]
      let trustScore: number

      if (isOfficial) {
        status = "official"
        trustScore = 100
      } else if (isScam) {
        status = "danger"
        trustScore = 0
      } else {
        const scoreResult = calculateTrustScore(url)
        trustScore = scoreResult.score
        if (trustScore >= 60) status = "safe"
        else if (trustScore >= 40) status = "warning"
        else status = "danger"
      }

      setResults((prev) => [
        ...prev,
        {
          url,
          trustScore,
          level: trustScore >= 80 ? "excellent" : trustScore >= 60 ? "good" : trustScore >= 40 ? "moderate" : "poor",
          status,
        },
      ])
    }

    setIsScanning(false)
  }

  const getStatusIcon = (status: BulkResult["status"]) => {
    switch (status) {
      case "official":
        return <BadgeCheck className="w-4 h-4 text-blue-500" />
      case "safe":
        return <CheckCircle2 className="w-4 h-4 text-success" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning" />
      case "danger":
        return <XCircle className="w-4 h-4 text-destructive" />
    }
  }

  const getStatusColor = (status: BulkResult["status"]) => {
    switch (status) {
      case "official":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "safe":
        return "bg-success/10 text-success border-success/20"
      case "warning":
        return "bg-warning/10 text-warning border-warning/20"
      case "danger":
        return "bg-destructive/10 text-destructive border-destructive/20"
    }
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Bulk URL Scanner</h3>
        </div>

        <textarea
          placeholder="Enter multiple URLs (one per line)&#10;Example:&#10;https://example.com&#10;https://another-site.com"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          disabled={isScanning}
          rows={6}
          className="w-full px-4 py-3 text-sm rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
        />

        <Button
          onClick={handleBulkScan}
          disabled={!urls.trim() || isScanning}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scanning {results.length} of {urls.split("\n").filter((u) => u.trim()).length}...
            </>
          ) : (
            <>Scan All URLs</>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2 mt-6">
            <h4 className="font-semibold text-sm text-foreground mb-3">
              Results ({results.length}/{urls.split("\n").filter((u) => u.trim()).length})
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(result.status)}
                    <span className="text-sm text-foreground truncate">{result.url}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={getStatusColor(result.status)}>
                      {result.trustScore}/100
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
