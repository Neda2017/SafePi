"use client"

import { useState } from "react"
import { BadgeCheck, ExternalLink, Globe, Share2, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { safeSites } from "@/lib/safe-sites"

export function OfficialSites() {
  const [isOpen, setIsOpen] = useState(false)

  const websites = safeSites.filter((site) => site.type === "website")
  const socialMedia = safeSites.filter((site) => site.type === "social")

  return (
    <Card className="p-4 bg-card border-border">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-foreground">Official Pi Network Sites</h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {isOpen && (
        <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Websites
            </h4>
            <div className="space-y-2">
              {websites.map((site, index) => (
                <a
                  key={index}
                  href={`https://${site.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between p-3 rounded-lg bg-background border border-border hover:border-blue-500/50 transition-colors group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{site.name}</span>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                        <BadgeCheck className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{site.description}</p>
                    <p className="text-xs text-blue-500 mt-1">{site.url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Social Media
            </h4>
            <div className="space-y-2">
              {socialMedia.map((site, index) => (
                <a
                  key={index}
                  href={`https://${site.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between p-3 rounded-lg bg-background border border-border hover:border-blue-500/50 transition-colors group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{site.name}</span>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                        <BadgeCheck className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{site.description}</p>
                    <p className="text-xs text-blue-500 mt-1">{site.url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
