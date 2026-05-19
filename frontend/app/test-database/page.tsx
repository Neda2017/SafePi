"use client"

import { useState, useEffect } from "react"
import { Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestDatabasePage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dbSize, setDbSize] = useState(0)

  useEffect(() => {
    async function runTests() {
      try {
        setIsLoading(true)
        setError(null)

        const { scamDatabase } = await import("@/lib/scam-database")
        const { calculateTrustScore } = await import("@/lib/trust-score")

        setDbSize(scamDatabase.length)

        const testUrls = ["https://unlockpi.org/", "https://minepidex.com/", "unlockpi.org", "minepidex.com"]

        const results = testUrls.map((url) => {
          const trustScore = calculateTrustScore(url)

          const normalizedUrl = url
            .toLowerCase()
            .trim()
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, "")
            .replace(/^www\./, "")

          const foundInDb = scamDatabase.find((scam) => {
            const scamNormalized = scam.url
              .toLowerCase()
              .trim()
              .replace(/^https?:\/\//, "")
              .replace(/\/$/, "")
              .replace(/^www\./, "")

            return (
              scamNormalized === normalizedUrl ||
              normalizedUrl.includes(scamNormalized) ||
              scamNormalized.includes(normalizedUrl)
            )
          })

          return {
            url,
            normalizedUrl,
            trustScore: trustScore.score,
            threatLabel: trustScore.threatLabel,
            foundInDb: !!foundInDb,
            dbEntry: foundInDb || null,
          }
        })

        setTestResults(results)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        console.error("[v0] Test page error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    runTests()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-xl">Loading database tests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <Card className="p-6 max-w-2xl bg-red-950 border-red-500">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white text-center mb-2">Error Loading Tests</h1>
          <p className="text-red-200 text-center">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-white">Database Test Results</h1>
          </div>
          <p className="text-gray-400">Testing if unlockpi.org and minepidex.com are detected</p>
        </div>

        <Card className="p-6 mb-6 bg-slate-900 border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Database Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Total Entries</p>
              <p className="text-3xl font-bold text-orange-500">{dbSize}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">URLs Tested</p>
              <p className="text-3xl font-bold text-orange-500">{testResults.length}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <Card key={index} className="p-6 bg-slate-900 border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="font-mono text-lg text-white mb-2">{result.url}</p>
                  <p className="text-sm text-gray-400">Normalized: {result.normalizedUrl}</p>
                </div>
                {result.foundInDb ? (
                  <XCircle className="w-8 h-8 text-red-500 shrink-0" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-500 shrink-0" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Trust Score</p>
                  <p className="text-2xl font-bold text-white">{result.trustScore}/100</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Threat Label</p>
                  <p
                    className={`text-2xl font-bold ${
                      result.threatLabel === "SAFE"
                        ? "text-green-500"
                        : result.threatLabel === "SUSPICIOUS"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {result.threatLabel}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                {result.foundInDb ? (
                  <div className="bg-red-950/50 border border-red-500 p-4 rounded-lg">
                    <p className="text-lg font-bold text-red-500 mb-2">✓ FOUND IN DATABASE</p>
                    {result.dbEntry && (
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>
                          Type: <span className="text-white font-semibold">{result.dbEntry.type}</span>
                        </p>
                        <p>
                          Severity: <span className="text-red-400 font-semibold">{result.dbEntry.severity}</span>
                        </p>
                        <p>
                          Reports: <span className="text-white font-semibold">{result.dbEntry.reports}</span>
                        </p>
                        <p className="mt-2 text-gray-400">{result.dbEntry.description}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-950/50 border border-green-500 p-4 rounded-lg">
                    <p className="text-lg font-bold text-green-500">✗ NOT IN DATABASE</p>
                    <p className="text-sm text-gray-400 mt-1">This URL is not flagged as suspicious</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" asChild className="bg-slate-800 text-white border-slate-600">
            <a href="/">← Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
