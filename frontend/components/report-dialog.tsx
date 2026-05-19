"use client"

import { useState } from "react"
import { AlertTriangle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ReportDialogProps {
  onClose: () => void
  onSubmit: (url: string, description: string, type: string) => void
}

export function ReportDialog({ onClose, onSubmit }: ReportDialogProps) {
  const [reportUrl, setReportUrl] = useState("")
  const [description, setDescription] = useState("")
  const [selectedType, setSelectedType] = useState("")

  const threatTypes = [
    "Fake Login Page",
    "Phony Wallet",
    "Fake 2FA",
    "Giveaway Scam",
    "Fake Staking",
    "Scam Exchange",
    "Other",
  ]

  const handleSubmit = () => {
    if (reportUrl && description && selectedType) {
      onSubmit(reportUrl, description, selectedType)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Report Scam Site</h3>
            <p className="text-xs text-muted-foreground">Help protect the community</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Website URL</label>
            <Input
              type="url"
              placeholder="https://suspicious-site.com"
              value={reportUrl}
              onChange={(e) => setReportUrl(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Threat Type</label>
            <div className="flex flex-wrap gap-2">
              {threatTypes.map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className={`cursor-pointer transition-colors ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-secondary"
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
            <Textarea
              placeholder="Describe what makes this site suspicious..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-border min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 border-border bg-transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground"
            onClick={handleSubmit}
            disabled={!reportUrl || !description || !selectedType}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Report
          </Button>
        </div>
      </Card>
    </div>
  )
}
