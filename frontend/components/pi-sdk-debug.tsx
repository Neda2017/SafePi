"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PiSDKDebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [sdkStatus, setSdkStatus] = useState<string>("checking")
  const [piWindow, setPiWindow] = useState<boolean>(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const checkSDK = () => {
      const hasPi = typeof window !== "undefined" && "Pi" in window
      setPiWindow(hasPi)

      if (hasPi) {
        setSdkStatus("loaded")
        setLogs((prev) => [...prev, `✓ Pi SDK detected at ${new Date().toLocaleTimeString()}`])
      } else {
        setSdkStatus("not_loaded")
        setLogs((prev) => [...prev, `✗ Pi SDK not found at ${new Date().toLocaleTimeString()}`])
      }
    }

    checkSDK()
    const interval = setInterval(checkSDK, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-40 bg-background"
      >
        Debug SDK
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 max-h-96 bg-background shadow-xl border-2">
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Pi SDK Status</h3>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            {sdkStatus === "loaded" ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : sdkStatus === "checking" ? (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span>
              Pi SDK:{" "}
              <Badge variant="outline" className="text-xs">
                {piWindow ? "✓ Found" : "✗ Missing"}
              </Badge>
            </span>
          </div>

          {typeof window !== "undefined" && "Pi" in window && (
            <div className="text-muted-foreground">
              <p>
                <code className="bg-secondary px-2 py-1 rounded text-[11px]">
                  typeof window.Pi = {typeof (window as any).Pi}
                </code>
              </p>
            </div>
          )}
        </div>

        <div className="border-t pt-2">
          <h4 className="text-xs font-semibold mb-2">Debug Logs:</h4>
          <div className="bg-secondary rounded p-2 max-h-32 overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-[11px]">No logs yet...</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className="text-[11px] text-muted-foreground font-mono">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>

        <Button
          onClick={() => {
            const piLogs = JSON.parse(localStorage.getItem("error_logs") || "[]")
            console.log("Pi Error Logs:", piLogs)
            setLogs((prev) => [
              ...prev,
              `→ ${piLogs.length} error logs found in localStorage`,
            ])
          }}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          Check Error Logs
        </Button>
      </div>
    </Card>
  )
}
