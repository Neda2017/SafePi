"use client"

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  Lock,
  Globe,
  AlertCircle,
  Share2,
  Clock,
  Users,
  TrendingUp,
  Search,
  Copy,
  BookmarkPlus,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { scamDatabase } from "@/lib/scam-database"
import { safeSites } from "@/lib/safe-sites"
import { calculateTrustScore } from "@/lib/trust-score"
import { translations, type Language } from "@/lib/translations"

interface ScanResultsProps {
  url: string
  onShare: () => void
  scanHistory: Array<{ url: string; result: string; timestamp: string }>
  trustScore?: number | null
  language?: Language
}

export function ScanResults({ url, onShare, scanHistory, trustScore, language = "en" }: ScanResultsProps) {
  const t = translations[language]
  const { toast } = useToast()

  const normalizedUrl = url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")

  const safeSite = safeSites.find(
    (site) => normalizedUrl.includes(site.url.toLowerCase()) || site.url.toLowerCase().includes(normalizedUrl),
  )

  const scamEntry = scamDatabase.find((scam) => {
    const scamNorm = scam.url
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .replace(/^www\./, "")
    return scamNorm === normalizedUrl ||
      normalizedUrl.includes(scamNorm) ||
      scamNorm.includes(normalizedUrl) ||
      normalizedUrl.split("/")[0] === scamNorm.split("/")[0]
  })

  // Always recalculate the full result to get the correct threatLabel
  const scoreResult = calculateTrustScore(url)
  const finalTrustScore = scoreResult.score
  const detectedPatterns = scoreResult.detectedPatterns || []
  const threatLabel = scoreResult.threatLabel || "SAFE"

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-blue-500"
    if (score >= 40) return "text-warning"
    return "text-destructive"
  }

  const getTrustScoreLevel = (score: number) => {
    if (score >= 80) return t.excellent
    if (score >= 60) return t.good
    if (score >= 40) return t.moderate
    if (score >= 20) return t.poor
    return t.dangerous
  }

  const getThreatLabelStyle = (label: string) => {
    switch (label) {
      case "DANGEROUS":
      case "PHISHING":
        return "bg-destructive text-white"
      case "FAKE SITE":
      case "SCAM":
        return "bg-destructive/90 text-white"
      case "SUSPICIOUS":
        return "bg-warning text-warning-foreground"
      case "SAFE":
        return "bg-success text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const checks = [
    {
      name: t.sslCertificate,
      status: safeSite || !scamEntry ? "pass" : "fail",
      icon: Lock,
      detail: safeSite || !scamEntry ? "Valid SSL certificate" : "Invalid or missing SSL certificate",
    },
    {
      name: t.domainReputation,
      status: safeSite || !scamEntry ? "pass" : "fail",
      icon: Globe,
      detail: safeSite
        ? "Official Pi Network domain"
        : !scamEntry
          ? "Domain has good reputation"
          : "Domain flagged by community",
    },
    {
      name: t.phishingPatterns,
      status: safeSite || !scamEntry ? "pass" : "fail",
      icon: Shield,
      detail: safeSite || !scamEntry ? "No phishing patterns detected" : "Phishing patterns detected",
    },
    {
      name: t.communityReports,
      status: safeSite || !scamEntry ? "pass" : "fail",
      icon: Users,
      detail: safeSite
        ? "Verified official site"
        : !scamEntry
          ? "No community reports"
          : scamEntry
            ? `${scamEntry.reports} reports filed`
            : "Multiple reports filed",
    },
  ]

  const addToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const alreadySaved = favorites.some((f: { url: string }) => f.url === url)
    if (alreadySaved) {
      toast({ title: "Already saved", description: "This URL is already in your favorites." })
      return
    }
    const newFavorite = {
      url,
      label: url,
      addedDate: new Date().toISOString().split("T")[0],
      trustScore: finalTrustScore,
      notes: `Trust score: ${finalTrustScore}/100`,
    }
    favorites.push(newFavorite)
    localStorage.setItem("favorites", JSON.stringify(favorites))
    toast({ title: "Saved to favorites", description: url })
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(url)
    toast({ title: "URL copied to clipboard" })
  }

  return (
    <Card className="p-6 md:p-8 bg-card border-2 border-border shadow-xl space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className={`flex-1 px-6 py-3 rounded-xl font-bold text-lg ${getThreatLabelStyle(threatLabel)} shadow-lg`}>
          {threatLabel}
        </div>
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-secondary"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(finalTrustScore / 100) * 251.2} 251.2`}
              className={`${getTrustScoreColor(finalTrustScore)} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={`text-2xl font-bold ${getTrustScoreColor(finalTrustScore)}`}>{finalTrustScore}</p>
            <p className="text-[10px] text-muted-foreground">/100</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-background border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-5 h-5 ${getTrustScoreColor(finalTrustScore)}`} />
            <div>
              <p className="text-sm font-semibold text-foreground">{t.trustScore}</p>
              <p className="text-xs text-muted-foreground">{getTrustScoreLevel(finalTrustScore)}</p>
            </div>
          </div>
        </div>
        {/* Visual meter with zones */}
        <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-destructive/20" />
            <div className="flex-1 bg-warning/20" />
            <div className="flex-1 bg-blue-500/20" />
            <div className="flex-1 bg-success/20" />
          </div>
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
              finalTrustScore < 40
                ? "bg-destructive"
                : finalTrustScore < 60
                  ? "bg-warning"
                  : finalTrustScore < 80
                    ? "bg-blue-500"
                    : "bg-success"
            }`}
            style={{ width: `${finalTrustScore}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span>Danger</span>
          <span>Warning</span>
          <span>Good</span>
          <span>Safe</span>
        </div>
      </div>

      {detectedPatterns.length > 0 && (
        <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-destructive" />
            <h4 className="font-semibold text-sm text-destructive">
              {threatLabel === "PHISHING"
                ? "Phishing Patterns Detected"
                : threatLabel === "FAKE SITE"
                  ? "Fake Site Indicators Found"
                  : threatLabel === "SCAM"
                    ? "Scam Indicators Detected"
                    : "Suspicious Patterns Detected"}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {detectedPatterns.map((pattern, index) => (
              <Badge key={index} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                {pattern}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="text-center pb-6 border-b border-border animate-in fade-in slide-in-from-top-4 duration-500">
        {threatLabel === "SAFE" ? (
          <>
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-success/10 flex items-center justify-center border-4 border-success/30">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-success mb-3">{t.safeWebsite}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">{t.safeWebsiteDesc}</p>
          </>
        ) : threatLabel === "SUSPICIOUS" ? (
          <>
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-warning/20 rounded-full animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center border-4 border-warning/30">
                <AlertTriangle className="w-10 h-10 text-warning" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-warning mb-3">{t.proceedCaution}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">{t.proceedCautionDesc}</p>
            {scamEntry && (
              <div className="mt-4 p-4 bg-warning/5 rounded-xl border border-warning/20 text-left max-w-md mx-auto">
                <p className="text-sm text-warning font-semibold mb-1">Threat Type: {scamEntry.type}</p>
                <p className="text-xs text-muted-foreground mb-3">{scamEntry.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{scamEntry.reports} reports</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{scamEntry.lastReported}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : threatLabel === "DANGEROUS" ||
          threatLabel === "PHISHING" ||
          threatLabel === "FAKE SITE" ||
          threatLabel === "SCAM" ? (
          <>
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-destructive/20 rounded-full animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center border-4 border-destructive/30">
                <XCircle className="w-10 h-10 text-destructive" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-destructive mb-3">{t.dangerousWebsite}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">{t.dangerousWebsiteDesc}</p>
            {scamEntry && (
              <div className="mt-4 p-4 bg-destructive/5 rounded-xl border border-destructive/20 text-left max-w-md mx-auto">
                <p className="text-sm text-destructive font-semibold mb-1">Threat Type: {scamEntry.type}</p>
                <p className="text-xs text-muted-foreground mb-3">{scamEntry.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{scamEntry.reports} reports</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{scamEntry.lastReported}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center mx-auto mb-4 border-4 border-muted/30">
              <AlertCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-muted-foreground mb-3">{t.unknownWebsite}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">{t.unknownWebsiteDesc}</p>
          </>
        )}
      </div>

      {/* Security Checks */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground mb-3">{t.securityAnalysis}</h4>
        {checks.map((check, index) => {
          const Icon = check.icon
          return (
            <div
              key={index}
              className="flex items-start justify-between p-3 rounded-lg bg-background border border-border"
            >
              <div className="flex items-start gap-3 flex-1">
                <Icon className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <span className="text-sm text-foreground block">{check.name}</span>
                  <span className="text-xs text-muted-foreground">{check.detail}</span>
                </div>
              </div>
              {check.status === "pass" ? (
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 shrink-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {t.pass}
                </Badge>
              ) : check.status === "warning" ? (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 shrink-0">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {t.warning}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 shrink-0">
                  <XCircle className="w-3 h-3 mr-1" />
                  {t.fail}
                </Badge>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={copyUrl}>
          <Copy className="w-4 h-4 mr-2" />
          Copy URL
        </Button>
        {finalTrustScore >= 80 && (
          <Button variant="outline" className="flex-1 bg-transparent" onClick={addToFavorites}>
            <BookmarkPlus className="w-4 h-4 mr-2" />
            Save
          </Button>
        )}
        <Button
          variant="outline"
          className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
          onClick={onShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {t.shareResult}
        </Button>
      </div>
    </Card>
  )
}
