"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
  Shield,
  Search,
  AlertTriangle,
  Clipboard,
  Sun,
  Moon,
  BarChart3,
  Languages,
  TrendingUp,
  X,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScanResults } from "@/components/scan-results"
import { ScanHistory } from "@/components/scan-history"
import { EducationSection } from "@/components/education-section"
import { QuickDomainLookup } from "@/components/quick-domain-lookup"
import { RecentThreats } from "@/components/recent-threats"
import { OfficialSites } from "@/components/official-sites"
import { BulkScanner } from "@/components/bulk-scanner"
import { WalletChecker } from "@/components/wallet-checker"
import { ReportSite } from "@/components/report-site"
import { scamDatabase } from "@/lib/scam-database"
import { safeSites } from "@/lib/safe-sites"
import { calculateTrustScore } from "@/lib/trust-score"
import { LanguageProvider, useLanguage } from "@/contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HeroSection } from "@/components/hero-section"
import { BulkWalletChecker } from "@/components/bulk-wallet-checker"
import { Favorites } from "@/components/favorites"
import { usePiAuth } from "@/contexts/pi-auth-context"
import Link from "next/link"
import { AdvancedSearch } from "@/components/advanced-search"
import { RealTimeFeed } from "@/components/real-time-feed"
import { registerServiceWorker, requestNotificationPermission } from "@/lib/pwa-service-worker"
import { PaymentModal } from "@/components/payment-modal"
import { PAYMENT_CONFIG } from "@/lib/payment-config"
import { LiveStats } from "@/components/live-stats"
import { RecentActivity } from "@/components/recent-activity"
import { StatsDashboard } from "@/components/stats-dashboard"
import { WelcomeBanner } from "@/components/welcome-banner"
import { ThreatSearch } from "@/components/threat-search"
import { EnhancedTrustScore } from "@/components/enhanced-trust-score"
import { NotificationSystem } from "@/components/notification-system"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { RealtimeStats } from "@/components/realtime-stats"
import { calculateEnhancedTrustScore, type TrustScoreDetails } from "@/lib/trust-score-engine"
import { trackScan, trackPayment, trackShare } from "@/lib/analytics"
import { checkRateLimit } from "@/lib/rate-limiter"
import { RateLimitWarning } from "@/components/rate-limit-warning"
import { HoneypotField } from "@/components/honeypot-field"
import { saveAuthState } from "@/lib/auth-persistence"
import { NavigationGuard } from "@/components/navigation-guard"
import { PiWalletDisplay } from "@/components/pi-wallet-display"
import { PiSDKDebugPanel } from "@/components/pi-sdk-debug"
import { useAuthInjection } from "@/hooks/use-auth-injection"
import { Language, translations } from "@/lib/translations"

interface HistoryItem {
  url: string
  result: "safe" | "warning" | "danger" | "official"
  timestamp: string
  trustScore?: number
  isSafe?: boolean
}

function HomePageContent() {
  // Inject fallback auth to prevent white screen if Pi SDK times out
  useAuthInjection()

  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [scanHistory, setScanHistory] = useState<HistoryItem[]>([])
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState("")
  const [showTutorial, setShowTutorial] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showTrends, setShowTrends] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [showFAB, setShowFAB] = useState(false)
  const { language, setLanguage } = useLanguage()
  const t = translations[language]
  const tFallback = t as typeof t & Record<string, string | undefined>
  const copy = (key: string, fallback: string) => tFallback[key] || fallback
  const [currentTrustScore, setCurrentTrustScore] = useState<number | null>(null)
  const [enhancedTrustDetails, setEnhancedTrustDetails] = useState<TrustScoreDetails | null>(null)
  const [scanCache, setScanCache] = useState<Map<string, any>>(new Map())
  const [debouncedUrl, setDebouncedUrl] = useState("")
  const [dailyPass, setDailyPass] = useState<{ active: boolean; expiresAt: number } | null>(null)
  const [freeScansRemaining, setFreeScansRemaining] = useState(PAYMENT_CONFIG.FREE_SCANS_PER_DAY)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [rateLimitStatus, setRateLimitStatus] = useState({
    allowed: true,
    remaining: 10,
    resetIn: 60000,
    blocked: false,
    suspicious: false,
  })

  const { userData, piAccessToken, isAuthenticated } = usePiAuth()

  // Persist auth state to sessionStorage so re-navigation doesn't trigger
  // a full Pi SDK re-init and blank screen
  useEffect(() => {
    if (isAuthenticated && piAccessToken) {
      saveAuthState({
        isAuthenticated: true,
        accessToken: piAccessToken,
        username: userData?.username ?? null,
        timestamp: Date.now(),
      })
    }
  }, [isAuthenticated, piAccessToken, userData])

  const APP_VERSION = "2025-02-03-v3"
  const DB_SIZE = useMemo(() => scamDatabase.length, [])

  useEffect(() => {
    const saved = localStorage.getItem("scanHistory")
    if (saved) {
      setScanHistory(JSON.parse(saved))
    }
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      setShowTutorial(true)
      localStorage.setItem("hasVisited", "true")
    }
    // Force dark mode
    setTheme("dark")
    document.documentElement.classList.add("dark")
    localStorage.setItem("theme", "dark")

    const handleScroll = () => {
      setShowFAB(window.scrollY > 200)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUrl(url)
    }, 300)
    return () => clearTimeout(timer)
  }, [url])

  useEffect(() => {
    const cachedScans = localStorage.getItem("scanCache")
    if (cachedScans) {
      try {
        const parsed = JSON.parse(cachedScans)
        setScanCache(new Map(parsed))
      } catch (e) {
        console.error("Failed to load scan cache")
      }
    }
  }, [])

  useEffect(() => {
    registerServiceWorker()

    // Request notification permission after user interaction
    const timer = setTimeout(() => {
      requestNotificationPermission()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Check daily pass status
    const storedPass = localStorage.getItem("dailyPass")
    if (storedPass) {
      const pass = JSON.parse(storedPass)
      if (pass.expiresAt > Date.now()) {
        setDailyPass(pass)
      } else {
        localStorage.removeItem("dailyPass")
      }
    }

    // Track free scans per day
    const today = new Date().toDateString()
    const lastScanDate = localStorage.getItem("lastScanDate")
    const scansToday = Number.parseInt(localStorage.getItem("scansToday") || "0")

    if (lastScanDate !== today) {
      // Reset daily counter
      localStorage.setItem("lastScanDate", today)
      localStorage.setItem("scansToday", "0")
      setFreeScansRemaining(PAYMENT_CONFIG.FREE_SCANS_PER_DAY)
    } else {
      setFreeScansRemaining(Math.max(0, PAYMENT_CONFIG.FREE_SCANS_PER_DAY - scansToday))
    }
  }, [])

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorLog = {
        type: "global_error",
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        timestamp: new Date().toISOString(),
      }
      const logs = JSON.parse(localStorage.getItem("error_logs") || "[]")
      logs.push(errorLog)
      localStorage.setItem("error_logs", JSON.stringify(logs.slice(-50)))
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorLog = {
        type: "unhandled_rejection",
        reason: event.reason?.toString() || "Unknown",
        timestamp: new Date().toISOString(),
      }
      const logs = JSON.parse(localStorage.getItem("error_logs") || "[]")
      logs.push(errorLog)
      localStorage.setItem("error_logs", JSON.stringify(logs.slice(-50)))
    }

    // Intercept fetch to log 404s
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        if (response.status === 404) {
          console.error("[v0] 404 Error - Resource not found:", args[0])

          const errorLog = {
            type: "fetch_404",
            url: args[0].toString(),
            timestamp: new Date().toISOString(),
          }

          const logs = JSON.parse(localStorage.getItem("error_logs") || "[]")
          logs.push(errorLog)
          localStorage.setItem("error_logs", JSON.stringify(logs.slice(-50)))
        }
        return response
      } catch (error) {
        console.error("[v0] Fetch error:", error)
        throw error
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.fetch = originalFetch
    }
  }, [])

  const stats = {
    databaseThreats: scamDatabase.length,
    verifiedSites: safeSites.length,
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setUrl(text)
      }
    } catch (err) {
      // Clipboard access denied
    }
  }

  const isValidUrl = (urlString: string) => {
    try {
      const testUrl = urlString.startsWith("http") ? urlString : `https://${urlString}`
      new URL(testUrl)
      return true
    } catch {
      return urlString.includes(".") || urlString.startsWith("t.me")
    }
  }

  const handleScan = useCallback(async () => {
    // Check rate limit first (unless user has daily pass)
    if (!dailyPass?.active) {
      const rateLimitCheck = checkRateLimit("scan")
      setRateLimitStatus(rateLimitCheck)

      if (!rateLimitCheck.allowed || rateLimitCheck.blocked) {
        return
      }

      if (freeScansRemaining <= 0) {
        setShowPaymentModal(true)
        return
      }
    }

    const normalizedUrl = url
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")

    if (scanCache.has(normalizedUrl)) {
      const cached = scanCache.get(normalizedUrl)
      setScanComplete(true)
      setCurrentTrustScore(cached.trustScore)
      setScanHistory((prev) => [cached, ...prev].slice(0, 10))
      return
    }

    setIsScanning(true)
    setScanComplete(false)
    setScanProgress(0)
    setScanStatus("Initializing scan...")

    const steps = [
      { progress: 20, status: t.analyzingDomain, delay: 300 },
      { progress: 40, status: t.checkingSSL, delay: 400 },
      { progress: 60, status: t.scanningPhishing, delay: 400 },
      { progress: 80, status: t.checkingReports, delay: 300 },
      { progress: 100, status: t.finalizingAnalysis, delay: 200 },
    ]

    let totalDelay = 0
    steps.forEach(({ progress, status, delay }, index) => {
      totalDelay += delay
      setTimeout(() => {
        setScanProgress(progress)
        setScanStatus(status)
      }, totalDelay)
    })

    setTimeout(() => {
      const trustScoreResult = calculateTrustScore(url)
      setCurrentTrustScore(trustScoreResult.score)

      let result: "safe" | "warning" | "danger" | "official"
      let isSafe: boolean

      const isSafeSite = safeSites.some(
        (site) => normalizedUrl.includes(site.url.toLowerCase()) || site.url.toLowerCase().includes(normalizedUrl),
      )

      // Dangerous labels always override score-based logic
      const isDangerousLabel = ["PHISHING", "FAKE SITE", "SCAM", "DANGEROUS"].includes(
        trustScoreResult.threatLabel,
      )

      if (isSafeSite) {
        result = "official"
        isSafe = true
      } else if (isDangerousLabel || trustScoreResult.score === 0) {
        result = "danger"
        isSafe = false
      } else if (trustScoreResult.score < 40) {
        result = "danger"
        isSafe = false
      } else if (trustScoreResult.score < 60) {
        result = "warning"
        isSafe = false
      } else {
        result = "safe"
        isSafe = true
      }

      const newItem = {
        url,
        result,
        timestamp: new Date().toLocaleString(),
        trustScore: trustScoreResult.score,
        isSafe,
      }

      const newCache = new Map(scanCache)
      newCache.set(normalizedUrl, newItem)
      setScanCache(newCache)
      localStorage.setItem("scanCache", JSON.stringify(Array.from(newCache.entries())))

      const newHistory = [newItem, ...scanHistory].slice(0, 10)

      setScanHistory(newHistory)
      localStorage.setItem("scanHistory", JSON.stringify(newHistory))

      // Track analytics
      trackScan(url, trustScoreResult.score, !isSafe)

      if (!dailyPass?.active) {
        const scansToday = Number.parseInt(localStorage.getItem("scansToday") || "0")
        localStorage.setItem("scansToday", (scansToday + 1).toString())
        setFreeScansRemaining((prev) => Math.max(0, prev - 1))
      }
      setIsScanning(false)
      setScanComplete(true)
    }, totalDelay)
  }, [url, scanCache])

  const handleShare = async () => {
    const shareText = `I checked ${url} on Safeπ - Stay safe online!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Safeπ Scan Result",
          text: shareText,
          url: window.location.href,
        })
        trackShare("native", url)
      } catch (err) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(shareText)
      trackShare("clipboard", url)
      alert("Result copied to clipboard!")
    }
  }

  const handleRescan = useCallback((historyUrl: string) => {
    setUrl(historyUrl)
    setScanComplete(false)
    setCurrentTrustScore(null)
    setEnhancedTrustDetails(null)
    // Use a dedicated scan with the URL directly instead of relying on stale state
    setTimeout(() => {
      const btn = document.getElementById("scan-btn") as HTMLButtonElement
      if (btn) btn.click()
    }, 150)
  }, [])

  const handleClearHistory = () => {
    setScanHistory([])
    localStorage.removeItem("scanHistory")
  }

  const handleExportHistory = () => {
    const dataStr = JSON.stringify(scanHistory, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `safepi-scan-history-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const scrollToScan = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => {
      const input = document.querySelector('input[type="url"]') as HTMLInputElement
      input?.focus()
    }, 500)
  }

  const handlePaymentComplete = () => {
    const storedPass = localStorage.getItem("dailyPass")
    if (storedPass) {
      const pass = JSON.parse(storedPass)
      setDailyPass(pass)
      trackPayment(PAYMENT_CONFIG.DAILY_PASS_PRICE, "daily_pass")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <NavigationGuard />
      <WelcomeBanner />
      <div className="relative overflow-x-hidden">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Safeπ</h1>
                <p className="text-xs text-muted-foreground">
                  {copy("tagline", "Pi Network scam detection and link safety.")}
                </p>
              </div>
            </div>

            <PiWalletDisplay />

            <div className="flex items-center gap-2">
              <NotificationSystem />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="touch-manipulation bg-transparent">
                    <Languages className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage("en")}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("es")}>Español</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("zh")}>中文</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("pt")}>Português</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("fr")}>Français</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={() => setShowStats(!showStats)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation ${
                  showStats ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">{copy("stats", "Stats")}</span>
              </button>
            </div>
          </header>

          {/* Daily Pass Status Indicator */}
          {!dailyPass?.active && (
            <div className="mb-6 flex items-center justify-between p-4 bg-secondary/50 border border-border rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {copy("freeScans", "Free scans")}: {freeScansRemaining}/{PAYMENT_CONFIG.FREE_SCANS_PER_DAY}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {copy("upgradeForUnlimited", "Upgrade for unlimited daily scans.")}
                </p>
              </div>
              <Button onClick={() => setShowPaymentModal(true)} size="sm" className="ml-4">
                Get Daily Pass
              </Button>
            </div>
          )}

          {dailyPass?.active && (
            <div className="mb-6 flex items-center justify-between p-4 bg-success/10 border border-success rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm font-medium text-foreground">Daily Pass Active</p>
                  <p className="text-xs text-muted-foreground">
                    Expires: {new Date(dailyPass.expiresAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <HeroSection />

          {/* Stats Dashboard Modal */}
          {showStats && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Database Statistics</h2>
                  <button
                    onClick={() => setShowStats(false)}
                    className="p-2 hover:bg-secondary rounded-md transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <StatsDashboard databaseThreats={DB_SIZE} verifiedSites={safeSites.length} />
                </div>
              </div>
            </div>
          )}

          {/* Live Stats and Activity */}
          <div className="container mx-auto px-4 py-8">
            <RealtimeStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <RecentActivity />
              </div>
              <div>
                <Card className="p-6 bg-card/50 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-foreground mb-4">Stay Safe Online</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Learn how to protect yourself from scams, phishing, and fraudulent websites targeting Pi Network users.
                  </p>
                  <Link href="/education">
                    <Button className="w-full">View Safety Guide</Button>
                  </Link>
                </Card>
              </div>
            </div>
          </div>

          {/* Scanner Section */}
          <section className="mb-12">
            <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-2 border-border shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">{copy("scanUrl", "Scan a URL")}</h2>
                <p className="text-muted-foreground">{copy("enterUrl", "Enter website URL...")}</p>
              </div>

              {!dailyPass?.active && (
                <RateLimitWarning
                  remaining={rateLimitStatus.remaining}
                  resetIn={rateLimitStatus.resetIn}
                  blocked={rateLimitStatus.blocked}
                  suspicious={rateLimitStatus.suspicious}
                  maxRequests={10}
                  onUpgrade={() => setShowPaymentModal(true)}
                />
              )}

              <div className="space-y-4">
                <HoneypotField
                  onBotDetected={() => {
                    console.log("[v0] Bot detected via honeypot")
                    alert("Suspicious activity detected. Please try again.")
                  }}
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleScan()}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all touch-manipulation"
                    />
                    <button
                      onClick={handlePaste}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-secondary transition-colors touch-manipulation"
                      aria-label="Paste from clipboard"
                    >
                      <Clipboard className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <Button
                    id="scan-btn"
                    onClick={handleScan}
                    disabled={
                      !url ||
                      isScanning ||
                      !isValidUrl(url) ||
                      (!dailyPass?.active && rateLimitStatus.blocked)
                    }
                    size="lg"
                    className="sm:w-auto w-full touch-manipulation"
                  >
                    {isScanning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        {copy("scanning", "Scanning")}
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        {copy("scanNow", "Scan Now")}
                      </>
                    )}
                  </Button>
                </div>

                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{scanStatus}</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </section>

          {scanComplete && currentTrustScore !== null && (
            <>
              <ScanResults
                url={url}
                onShare={handleShare}
                scanHistory={scanHistory}
                trustScore={currentTrustScore}
                language={language}
              />
              {enhancedTrustDetails && (
                <div className="mt-6">
                  <EnhancedTrustScore details={enhancedTrustDetails} />
                </div>
              )}
            </>
          )}

          {scanHistory.length > 0 && (
            <ScanHistory
              history={scanHistory}
              onRescan={handleRescan}
              onClear={handleClearHistory}
              onExport={handleExportHistory}
              language={language}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <QuickDomainLookup language={language} />
            <RecentThreats language={language} />
          </div>

          <OfficialSites language={language} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <BulkScanner language={language} />
            <WalletChecker language={language} />
          </div>

          <div className="mt-8">
            <ReportSite language={language} />
          </div>

          <div className="mt-8">
            <ThreatSearch />
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <span className="font-bold text-lg text-foreground">Safeπ</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {copy("tagline", "Pi Network scam detection and link safety.")}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>v{APP_VERSION}</span>
                  <span>•</span>
                  <span>
                    {DB_SIZE.toLocaleString()} {copy("threats", "threats")}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">{copy("quickLinks", "Quick Links")}</h3>
                <div className="flex flex-col gap-2 text-sm">
                  <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                    {copy("dashboard", "Dashboard")}
                  </Link>
                  <Link href="/education" className="text-muted-foreground hover:text-primary transition-colors">
                    {copy("education", "Education")}
                  </Link>
                  <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                    Help & FAQ
                  </Link>
                  <Link href="/developer-setup" className="text-muted-foreground hover:text-primary transition-colors">
                    Developer Setup
                  </Link>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                  <Link href="/feedback" className="text-muted-foreground hover:text-primary transition-colors">
                    Feedback
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">{copy("legal", "Legal")}</h3>
                <div className="flex flex-col gap-2 text-sm">
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    {copy("privacy", "Privacy")}
                  </Link>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    {copy("terms", "Terms")}
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>{copy("footerText", "Community-powered real-time detection. © 2025 bill81. All rights reserved.")}</p>
            </div>
          </footer>
        </div>

        {showFAB && (
          <button
            onClick={scrollToScan}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 touch-manipulation"
            aria-label="Scroll to scan"
          >
            <Search className="w-6 h-6" />
          </button>
        )}

        <PaymentModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          onPaymentComplete={handlePaymentComplete}
        />

        <PWAInstallPrompt />
        <PiSDKDebugPanel />
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  )
}

export default HomePage
