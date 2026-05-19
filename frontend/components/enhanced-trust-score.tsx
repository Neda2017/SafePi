"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react"
import type { TrustScoreDetails } from "@/lib/trust-score-engine"

interface EnhancedTrustScoreProps {
  details: TrustScoreDetails
}

export function EnhancedTrustScore({ details }: EnhancedTrustScoreProps) {
  const getRiskColor = (riskLevel: TrustScoreDetails["riskLevel"]) => {
    switch (riskLevel) {
      case "safe":
        return "text-success"
      case "low":
        return "text-blue-500"
      case "medium":
        return "text-warning"
      case "high":
        return "text-orange-500"
      case "critical":
        return "text-destructive"
    }
  }

  const getRiskBadgeVariant = (riskLevel: TrustScoreDetails["riskLevel"]) => {
    if (riskLevel === "safe") return "default"
    if (riskLevel === "critical" || riskLevel === "high") return "destructive"
    return "outline"
  }

  const getScoreIcon = (score: number) => {
    if (score > 0) return <CheckCircle2 className="w-4 h-4 text-success" />
    if (score < 0) return <XCircle className="w-4 h-4 text-destructive" />
    return <Info className="w-4 h-4 text-muted-foreground" />
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Main Score */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Shield className={`w-12 h-12 ${getRiskColor(details.riskLevel)}`} />
            <div className="text-left">
              <div className="text-4xl font-bold text-foreground">{details.score}/100</div>
              <Badge variant={getRiskBadgeVariant(details.riskLevel)} className="mt-1">
                {details.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          </div>
          <Progress value={details.score} className="h-2" />
        </div>

        {/* Detailed Factors */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Analysis Factors</h3>
          
          {Object.entries(details.factors).map(([key, factor]) => (
            <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border">
              <div className="mt-0.5">{getScoreIcon(factor.score)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      factor.score > 0 ? "text-success" : factor.score < 0 ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {factor.score > 0 ? "+" : ""}
                    {factor.score}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{factor.details}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {details.recommendations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Security Recommendations</h3>
            <div className="space-y-2">
              {details.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
