"use client"

import { useState } from "react"
import { Flag, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ReportSiteProps {
  url: string
}

export function ReportSite({ url }: ReportSiteProps) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reportType, setReportType] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    const reports = JSON.parse(localStorage.getItem("userReports") || "[]")
    reports.push({
      url,
      type: reportType,
      description,
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem("userReports", JSON.stringify(reports))

    setSubmitted(true)
    setTimeout(() => {
      setShowForm(false)
      setSubmitted(false)
      setReportType("")
      setDescription("")
    }, 2000)
  }

  if (!showForm) {
    return (
      <Button
        variant="outline"
        className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
        onClick={() => setShowForm(true)}
      >
        <Flag className="w-4 h-4 mr-2" />
        Report This Site
      </Button>
    )
  }

  if (submitted) {
    return (
      <Card className="p-6 bg-success/5 border-success/20">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-success" />
          <div>
            <h3 className="font-semibold text-success">Report Submitted</h3>
            <p className="text-sm text-muted-foreground">Thank you for helping keep the community safe</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-4 border-destructive/20">
      <div className="flex items-center gap-2">
        <Flag className="w-5 h-5 text-destructive" />
        <h3 className="font-semibold text-foreground">Report Suspicious Site</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">What type of threat is this?</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
          >
            <option value="">Select type...</option>
            <option value="phishing">Phishing Attempt</option>
            <option value="fake_wallet">Fake Wallet</option>
            <option value="scam_airdrop">Scam Airdrop</option>
            <option value="impersonation">Impersonation</option>
            <option value="malware">Malware</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Additional Details (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened or what you noticed..."
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground resize-none"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => {
              setShowForm(false)
              setReportType("")
              setDescription("")
            }}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-destructive hover:bg-destructive/90"
            onClick={handleSubmit}
            disabled={!reportType}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Report
          </Button>
        </div>
      </div>
    </Card>
  )
}
