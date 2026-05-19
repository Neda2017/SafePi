"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, Search, History, BookOpen, Share2, ChevronRight, ChevronLeft } from "lucide-react"

interface TutorialDialogProps {
  open: boolean
  onClose: () => void
}

export function TutorialDialog({ open, onClose }: TutorialDialogProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      icon: Shield,
      title: "Welcome to Safeπ",
      description: "Your real-time protection against scams, phishing, and fake websites targeting Pi Network users.",
    },
    {
      icon: Search,
      title: "Scan Any Website",
      description:
        "Enter any URL in the search bar and click Scan. Our system analyzes the site in real-time to detect threats.",
    },
    {
      icon: History,
      title: "Track Your Scans",
      description:
        "All your scans are saved in history with color-coded threat levels. Tap any scan to check it again.",
    },
    {
      icon: Share2,
      title: "Protect Others",
      description: "Share scan results with friends and report suspicious sites to help the community stay safe.",
    },
    {
      icon: BookOpen,
      title: "Learn & Stay Safe",
      description: "Tap the Learn button to access safety tips and recognize common Pi Network scam patterns.",
    },
  ]

  const currentStep = steps[step]
  const Icon = currentStep.icon

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Getting Started</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{currentStep.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{currentStep.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${index === step ? "w-8 bg-primary" : "w-2 bg-muted"}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" onClick={handlePrev} disabled={step === 0} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button onClick={handleNext} className="gap-2">
              {step === steps.length - 1 ? "Get Started" : "Next"}
              {step < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
