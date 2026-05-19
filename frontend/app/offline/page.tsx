"use client"

import Link from "next/link"
import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-slate-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">You're Offline</h1>
          <p className="text-slate-400">No internet connection detected. Some features may be limited.</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-500">Don't worry! You can still:</p>
          <ul className="text-sm text-slate-400 space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>View previously scanned URLs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Access your saved favorites</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Browse the education center</span>
            </li>
          </ul>
        </div>

        <Button onClick={() => window.location.reload()} className="bg-cyan-600 hover:bg-cyan-700">
          Try Again
        </Button>

        <Link href="/" className="block text-sm text-cyan-400 hover:underline">
          Go to Homepage
        </Link>
      </div>
    </div>
  )
}
