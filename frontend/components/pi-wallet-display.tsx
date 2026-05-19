"use client"

import { useState, useEffect } from "react"
import { Wallet, AlertCircle, Loader2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { useToast } from "@/hooks/use-toast"

export function PiWalletDisplay() {
  const { userData, isAuthenticated, authMessage } = usePiAuth()
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [loadingWallet, setLoadingWallet] = useState(false)

  // Fetch wallet address from Pi SDK
  useEffect(() => {
    if (isAuthenticated && !walletAddress) {
      setLoadingWallet(true)
      const fetchWalletAddress = async () => {
        try {
          if (typeof window !== "undefined" && window.Pi) {
            // Request wallet address from Pi SDK
            const wallet = await window.Pi.requestWalletAddress?.()
            if (wallet) {
              setWalletAddress(wallet)
              console.log("[v0] Wallet address fetched:", wallet)
            }
          }
        } catch (error) {
          console.error("[v0] Failed to fetch wallet address:", error)
        } finally {
          setLoadingWallet(false)
        }
      }

      // Give SDK a moment to be ready
      const timer = setTimeout(fetchWalletAddress, 500)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, walletAddress])

  const handleCopyUsername = () => {
    if (userData?.username) {
      navigator.clipboard.writeText(userData.username)
      toast({
        title: "Copied",
        description: `Username @${userData.username} copied to clipboard`,
      })
    }
  }

  const handleCopyWallet = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      toast({
        title: "Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // Not authenticated - show loading state
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border animate-pulse">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground">{authMessage || "Initializing..."}</span>
      </div>
    )
  }

  // Authenticated - show user info and wallet
  if (userData) {
    return (
      <div className="flex flex-col gap-2">
        {/* Username Section */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/15 transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {userData.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-foreground truncate">@{userData.username}</span>
            <span className="text-xs text-primary/70">Pi Network</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyUsername}
            className="w-6 h-6 flex-shrink-0"
            title="Copy username"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>

        {/* Wallet Section */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 hover:bg-accent/15 transition-colors">
          <Wallet className="w-4 h-4 text-accent flex-shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            {loadingWallet ? (
              <>
                <span className="text-xs font-semibold text-muted-foreground">Fetching wallet...</span>
                <Loader2 className="w-3 h-3 text-accent animate-spin" />
              </>
            ) : walletAddress ? (
              <>
                <span className="text-xs font-semibold text-foreground">Wallet Address</span>
                <span className="text-xs text-accent/80 font-mono truncate">{walletAddress}</span>
              </>
            ) : (
              <>
                <span className="text-xs font-semibold text-muted-foreground">No wallet address</span>
                <span className="text-xs text-muted-foreground/70">Enable wallet access</span>
              </>
            )}
          </div>
          {walletAddress && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyWallet}
              className="w-6 h-6 flex-shrink-0"
              title="Copy wallet address"
            >
              <Copy className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Authentication error
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30">
      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
      <span className="text-xs text-destructive">Auth Failed</span>
    </div>
  )
}
