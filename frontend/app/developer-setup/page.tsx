"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Settings,
  Wallet,
  Code2,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { PAYMENT_CONFIG } from "@/lib/payment-config"

export default function DeveloperSetupPage() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied to clipboard" })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Developer Setup</h1>
          <p className="text-muted-foreground">Configure Safeπ for Pi Network Payments</p>
        </div>

        {/* Current Status */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Payment Setup Required</h2>
              <p className="text-sm text-muted-foreground">
                Your app wallet is not yet configured. Follow the steps below to enable Pi Network payments.
              </p>
            </div>
          </div>
        </Card>

        {/* Setup Steps */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Setup Steps</h2>

          {/* Step 1 */}
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2">Go to Pi Developer Dashboard</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Visit the Pi Network developer portal to manage your app.
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <a
                    href="https://minepi.com/developer/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Developer Dashboard
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2">Find Your App</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Locate "Safeπ" in your list of apps. Click on it to open the app settings.
                </p>
              </div>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2">Enable Payments</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  In the app settings, look for "Capabilities" or "Features" and enable "Payments".
                </p>
                <Badge className="bg-green-500/10 text-green-500 border border-green-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Required
                </Badge>
              </div>
            </div>
          </Card>

          {/* Step 4 */}
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">4</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2">Create or Verify Wallet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  In the "Wallet" section of your app settings, create a new wallet if one doesn't exist. This
                  wallet will receive Pi payments from users.
                </p>
              </div>
            </div>
          </Card>

          {/* Step 5 */}
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">5</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2">Copy Your Wallet Address</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Copy the wallet address from your app settings:
                </p>
                <div className="bg-zinc-900 p-3 rounded-lg font-mono text-xs text-zinc-400 break-all mb-3">
                  {PAYMENT_CONFIG.WALLET_ADDRESS}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(PAYMENT_CONFIG.WALLET_ADDRESS)}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Address
                </Button>
              </div>
            </div>
          </Card>

          {/* Step 6 */}
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">6</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2">Update Configuration</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Update the wallet address in your app code:
                </p>
                <div className="bg-zinc-900 p-3 rounded-lg font-mono text-xs overflow-x-auto mb-3">
                  <code className="text-green-400">{`lib/payment-config.ts`}</code>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <a href="/edit/lib/payment-config.ts">
                    <Code2 className="w-4 h-4" />
                    Edit Config File
                  </a>
                </Button>
              </div>
            </div>
          </Card>

          {/* Step 7 */}
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">7</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2">Deploy Your App</h3>
                <p className="text-sm text-muted-foreground">
                  Push your changes to production. Download the code from v0 and deploy to your hosting
                  platform.
                </p>
              </div>
            </div>
          </Card>

          {/* Step 8 */}
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">8</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2">Test Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Open your app in Pi Browser and test the Daily Pass purchase flow. Payments are simulated
                  in development mode (v0.app, localhost).
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Troubleshooting */}
        <Card className="p-6 bg-orange-500/10 border border-orange-500/20">
          <div className="space-y-3">
            <h3 className="font-semibold text-orange-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Troubleshooting
            </h3>
            <div className="space-y-2 text-sm text-orange-200/80">
              <p>
                <strong>"Developer wallet not created yet":</strong> You haven't created a wallet for your app
                in the Developer Dashboard. Follow Step 4 above.
              </p>
              <p>
                <strong>Payments not working in production:</strong> Ensure you updated the wallet address
                in payment-config.ts and redeployed.
              </p>
              <p>
                <strong>Testing in v0 or localhost:</strong> Payments are automatically simulated in
                development mode. No real Pi needed.
              </p>
            </div>
          </div>
        </Card>

        {/* Back Button */}
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Back to Scanner</Link>
        </Button>
      </div>
    </div>
  )
}
