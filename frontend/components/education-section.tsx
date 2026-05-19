"use client"

import { BookOpen, Shield, Eye, AlertCircle, Lock } from "lucide-react"
import { Card } from "@/components/ui/card"

export function EducationSection() {
  const tips = [
    {
      icon: Eye,
      title: "Check the URL carefully",
      description:
        "Scammers often use URLs that look similar to legitimate sites. Look for misspellings or extra characters.",
    },
    {
      icon: Lock,
      title: "Verify SSL certificates",
      description: "Legitimate sites use HTTPS. Look for the padlock icon in your browser's address bar.",
    },
    {
      icon: AlertCircle,
      title: "Be wary of urgent requests",
      description: "Scammers create urgency to pressure you. Take time to verify before entering personal information.",
    },
    {
      icon: Shield,
      title: "Never share your passphrase",
      description: "Pi Network will NEVER ask for your passphrase. Anyone requesting it is a scammer.",
    },
  ]

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Stay Safe Online</h3>
      </div>

      <div className="space-y-4">
        {tips.map((tip, index) => {
          const Icon = tip.icon
          return (
            <div key={index} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">{tip.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
