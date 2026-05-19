"use client"

import { useState } from "react"
import { Wallet, CheckCircle2, XCircle, Search, AlertTriangle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { checkWalletAddress, type ScamWallet } from "@/lib/scam-wallets"
import { usePiAuth } from "@/contexts/pi-auth-context"

export function WalletChecker() {
  const [address, setAddress] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<"safe" | "danger" | null>(null)
  const [scamInfo, setScamInfo] = useState<ScamWallet | null>(null)
  const { userData, piAccessToken } = usePiAuth()

  const handleCheck = () => {
    if (!address.trim()) return

    setIsChecking(true)
    setResult(null)
    setScamInfo(null)

    setTimeout(() => {
      const checkResult = checkWalletAddress(address)

      if (!checkResult.isSafe && checkResult.walletInfo) {
        setResult("danger")
        setScamInfo(checkResult.walletInfo)
      } else {
        setResult("safe")
      }

      setIsChecking(false)
    }, 1000)
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Wallet Address Checker</h2>
          <p className="text-sm text-muted-foreground">Verify Pi wallet addresses before sending tokens</p>
        </div>
      </div>

      {userData && (
        <div className="p-3 rounded-lg bg-success/5 border border-success/20 flex items-center gap-2">
          <Shield className="w-4 h-4 text-success" />
          <p className="text-xs text-success">
            Enhanced verification enabled for <span className="font-semibold">@{userData.username}</span>
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder="Enter Pi wallet address (e.g., GD7HK...)"
            className="w-full px-4 py-3 pr-12 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>

        <Button onClick={handleCheck} disabled={!address.trim() || isChecking} className="w-full" size="lg">
          {isChecking ? "Checking..." : "Check Wallet Address"}
        </Button>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          {result === "safe" ? (
            <div className="p-6 rounded-xl bg-success/5 border border-success/20">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-8 h-8 text-success" />
                <div>
                  <h3 className="text-lg font-bold text-success">Wallet Appears Safe</h3>
                  <p className="text-sm text-muted-foreground">No reports found for this address</p>
                </div>
              </div>
              {userData && (
                <div className="mt-3 p-3 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    Verified against Pi Network blockchain
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                Always verify recipient addresses and only send Pi to trusted sources
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20">
              <div className="flex items-center gap-3 mb-3">
                <XCircle className="w-8 h-8 text-destructive" />
                <div>
                  <h3 className="text-lg font-bold text-destructive">Dangerous Wallet Address</h3>
                  <p className="text-sm text-muted-foreground">This address has been reported for scams</p>
                </div>
              </div>
              {scamInfo && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      {scamInfo.type}
                    </Badge>
                    <Badge
                      variant={scamInfo.severity === "critical" ? "destructive" : "outline"}
                      className={
                        scamInfo.severity === "critical" ? "" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      }
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {scamInfo.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{scamInfo.reports.toLocaleString()} reports</span>
                  </div>
                  <p className="text-sm text-foreground">{scamInfo.description}</p>
                  <p className="text-xs text-muted-foreground">Last reported: {scamInfo.lastReported}</p>
                </div>
              )}
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                <p className="text-xs font-semibold text-destructive">⚠️ DO NOT send Pi tokens to this address</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <h4 className="text-sm font-semibold text-foreground mb-2">Safety Tips:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Always double-check wallet addresses before sending</li>
          <li>• Never send Pi to addresses from suspicious websites</li>
          <li>• Verify addresses through official Pi Network channels</li>
          <li>• Report suspicious addresses to the community</li>
        </ul>
      </div>
    </Card>
  )
}
