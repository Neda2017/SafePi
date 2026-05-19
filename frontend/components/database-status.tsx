"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DatabaseStatus() {
  const [status, setStatus] = useState<{
    totalEntries: number
    hasUnlockpi: boolean
    hasMinepidex: boolean
    hasConfpiwallet: boolean
    hasPiOnlineShop: boolean
    hasPinet7: boolean
    hasAirdropnet: boolean
    has2pidays: boolean
    timestamp: string
  } | null>(null)

  useEffect(() => {
    const checkDatabase = async () => {
      const { scamDatabase } = await import("@/lib/scam-database")

      const urls = scamDatabase.map((entry) => entry.url.toLowerCase())

      setStatus({
        totalEntries: scamDatabase.length,
        hasUnlockpi: urls.some((u) => u.includes("unlockpi")),
        hasMinepidex: urls.some((u) => u.includes("minepidex")),
        hasConfpiwallet: urls.some((u) => u.includes("confpiwallet")),
        hasPiOnlineShop: urls.some((u) => u.includes("pi-onlineshop")),
        hasPinet7: urls.some((u) => u.includes("pinet7")),
        hasAirdropnet: urls.some((u) => u.includes("airdropnet")),
        has2pidays: urls.some((u) => u.includes("2pidays")),
        timestamp: new Date().toISOString(),
      })
    }

    checkDatabase()
  }, [])

  if (!status) {
    return <div className="text-sm text-muted-foreground">Loading database status...</div>
  }

  return (
    <Card className="p-4 bg-background border-border">
      <h3 className="text-sm font-semibold mb-3">Database Status</h3>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span>Total Entries:</span>
          <Badge variant="secondary">{status.totalEntries}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>unlockpi.org:</span>
          <Badge variant={status.hasUnlockpi ? "destructive" : "secondary"}>
            {status.hasUnlockpi ? "✓ Found" : "✗ Missing"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>minepidex.com:</span>
          <Badge variant={status.hasMinepidex ? "destructive" : "secondary"}>
            {status.hasMinepidex ? "✓ Found" : "✗ Missing"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>confpiwallet.web.app:</span>
          <Badge variant={status.hasConfpiwallet ? "destructive" : "secondary"}>
            {status.hasConfpiwallet ? "✓ Found" : "✗ Missing"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>pi-onlineshop.net:</span>
          <Badge variant={status.hasPiOnlineShop ? "destructive" : "secondary"}>
            {status.hasPiOnlineShop ? "✓ Found" : "✗ Missing"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>pinet7.com:</span>
          <Badge variant={status.hasPinet7 ? "destructive" : "secondary"}>
            {status.hasPinet7 ? "✓ Found" : "✗ Missing"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>airdropnet2025.com:</span>
          <Badge variant={status.hasAirdropnet ? "destructive" : "secondary"}>
            {status.hasAirdropnet ? "✓ Found" : "✗ Missing"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>2pidays.net:</span>
          <Badge variant={status.has2pidays ? "destructive" : "secondary"}>
            {status.has2pidays ? "✓ Found" : "✗ Missing"}
          </Badge>
        </div>
        <div className="pt-2 text-[10px] text-muted-foreground">
          Loaded: {new Date(status.timestamp).toLocaleString()}
        </div>
      </div>
    </Card>
  )
}
