"use client"

import { Shield, Database, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { scamDatabase } from "@/lib/scam-database"

export default function DatabaseStatusPage() {
  const APP_VERSION = "2025-02-03-v3"
  const DB_SIZE = scamDatabase.length

  const testUrls = [
    "unlockpi.org",
    "minepidex.com",
    "confpiwallet.web.app",
    "pi-onlineshop.net",
    "pinet7.com",
    "airdropnet2025.com",
    "2pidays.net",
    "2pidays.us",
    "swapbase.finance",
    "medaigenesis.cc",
  ]

  const checkUrl = (url: string) => {
    return scamDatabase.some((s) => s.url.includes(url))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Safeπ</h1>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Database Status</h2>
          </div>

          {/* Version Info */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">App Version</span>
                <span className="text-lg font-bold text-foreground">{APP_VERSION}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Database Entries</span>
                <span className="text-lg font-bold text-primary">{DB_SIZE}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                <span className="text-lg font-bold text-foreground">May 2025</span>
              </div>
            </div>
          </Card>

          {/* Test URLs Status */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Database Test - Recently Added URLs</h3>
            <div className="space-y-3">
              {testUrls.map((url) => {
                const found = checkUrl(url)
                return (
                  <div
                    key={url}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      found ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
                    }`}
                  >
                    <span className="font-mono text-sm">{url}</span>
                    <div className="flex items-center gap-2">
                      {found ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-medium text-green-500">FOUND</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <span className="text-sm font-medium text-red-500">MISSING</span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Database Categories */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Threat Categories</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-2xl font-bold text-red-500">
                  {scamDatabase.filter((s) => s.type.toLowerCase().includes("phishing")).length}
                </div>
                <div className="text-sm text-muted-foreground">Phishing Sites</div>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="text-2xl font-bold text-orange-500">
                  {scamDatabase.filter((s) => s.type.toLowerCase().includes("fake")).length}
                </div>
                <div className="text-sm text-muted-foreground">Fake Sites</div>
              </div>
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="text-2xl font-bold text-yellow-500">
                  {scamDatabase.filter((s) => s.type.toLowerCase().includes("scam")).length}
                </div>
                <div className="text-sm text-muted-foreground">Scam Sites</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-500">
                  {scamDatabase.filter((s) => s.severity === "critical").length}
                </div>
                <div className="text-sm text-muted-foreground">Critical Threats</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
