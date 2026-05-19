"use client"

import { Clock, CheckCircle2, AlertTriangle, XCircle, Trash2, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface HistoryItem {
  url: string
  result: "safe" | "warning" | "danger"
  timestamp: string
}

interface ScanHistoryProps {
  history: HistoryItem[]
  onRescan: (url: string) => void
  onClear: () => void
  onExport: () => void
}

export function ScanHistory({ history, onRescan, onClear, onExport }: ScanHistoryProps) {
  if (history.length === 0) {
    return null
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Recent Scans</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="text-primary hover:text-primary hover:bg-primary/10"
            title="Export scan history"
          >
            <Download className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Clear All</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {history.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {item.result === "safe" ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              ) : item.result === "warning" ? (
                <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{item.url}</p>
                <p className="text-xs text-muted-foreground">{item.timestamp}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="shrink-0 text-xs" onClick={() => onRescan(item.url)}>
              Rescan
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
