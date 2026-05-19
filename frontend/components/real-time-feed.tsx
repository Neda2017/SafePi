"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

export function RealTimeFeed() {
  const [threats, setThreats] = useState<Array<{ url: string; type: string; timestamp: string }>>([])

  useEffect(() => {
    // Simulate real-time feed with recent database additions
    const interval = setInterval(() => {
      const newThreat = {
        url: "Recently reported site",
        type: "Phishing",
        timestamp: new Date().toISOString(),
      }
      setThreats((prev) => [newThreat, ...prev].slice(0, 10))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-4 bg-slate-900/50 border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-semibold text-white">Live Threat Feed</h3>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {threats.length === 0 ? (
          <p className="text-sm text-slate-400">No new threats in the last 30 minutes</p>
        ) : (
          threats.map((threat, idx) => (
            <div key={idx} className="p-2 bg-slate-800 rounded text-xs">
              <div className="flex items-center justify-between">
                <span className="text-orange-400">{threat.type}</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(threat.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-slate-300 mt-1 truncate">{threat.url}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
