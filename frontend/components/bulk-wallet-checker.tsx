"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Download, CheckCircle2, XCircle, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { checkWalletAddress } from "@/lib/scam-wallets"

interface WalletResult {
  address: string
  status: "safe" | "danger"
  severity?: string
  type?: string
  reports?: number
}

export function BulkWalletChecker() {
  const [addresses, setAddresses] = useState("")
  const [results, setResults] = useState<WalletResult[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const handleCheck = () => {
    const addressList = addresses
      .split(/[\n,]/)
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0)

    if (addressList.length === 0) return

    setIsChecking(true)
    setResults([])

    setTimeout(() => {
      const checkResults = addressList.map((address) => {
        const result = checkWalletAddress(address)
        return {
          address,
          status: result.isSafe ? "safe" : "danger",
          severity: result.walletInfo?.severity,
          type: result.walletInfo?.type,
          reports: result.walletInfo?.reports,
        } as WalletResult
      })

      setResults(checkResults)
      setIsChecking(false)
    }, 1500)
  }

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setAddresses(text.replace(/,/g, "\n"))
    }
    reader.readAsText(file)
  }

  const exportResults = () => {
    const csv = [
      "Address,Status,Type,Reports,Severity",
      ...results.map((r) => `${r.address},${r.status},${r.type || "N/A"},${r.reports || 0},${r.severity || "N/A"}`),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wallet-check-results-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const stats = {
    total: results.length,
    safe: results.filter((r) => r.status === "safe").length,
    danger: results.filter((r) => r.status === "danger").length,
  }

  return (
    <Card className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-hidden min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg md:text-xl font-bold text-foreground truncate">Bulk Wallet Checker</h2>
          <p className="text-xs md:text-sm text-muted-foreground truncate">Check multiple wallet addresses at once</p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={addresses}
          onChange={(e) => setAddresses(e.target.value)}
          placeholder="Enter wallet addresses (one per line or comma-separated)"
          className="w-full h-32 px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />

        <div className="flex gap-2">
          <Button onClick={handleCheck} disabled={!addresses.trim() || isChecking} className="flex-1">
            {isChecking ? "Checking..." : "Check All Addresses"}
          </Button>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
              <input type="file" accept=".csv,.txt" onChange={handleCSVUpload} className="hidden" />
            </label>
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-background border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Checked</p>
            </div>
            <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-center">
              <p className="text-2xl font-bold text-success">{stats.safe}</p>
              <p className="text-xs text-success">Safe</p>
            </div>
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <p className="text-2xl font-bold text-destructive">{stats.danger}</p>
              <p className="text-xs text-destructive">Dangerous</p>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto overflow-x-hidden">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-background border border-border flex items-center gap-3 min-w-0"
              >
                {result.status === "safe" ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-foreground truncate break-all">{result.address}</p>
                  {result.type && (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge
                        variant="outline"
                        className={
                          result.severity === "critical"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }
                      >
                        {result.type}
                      </Badge>
                      {result.reports && (
                        <span className="text-xs text-muted-foreground">{result.reports} reports</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button onClick={exportResults} variant="outline" className="w-full bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export Results as CSV
          </Button>
        </div>
      )}
    </Card>
  )
}
