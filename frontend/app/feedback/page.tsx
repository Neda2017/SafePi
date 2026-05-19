"use client"

import React from "react"

import { useState } from "react"
import { Shield, Star, Send } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function FeedbackPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const feedbackData = {
      id: Date.now().toString(),
      name,
      email,
      rating,
      feedback,
      timestamp: new Date().toISOString(),
      approved: false,
    }

    // Save to localStorage
    const existing = localStorage.getItem("userFeedback")
    const feedbackList = existing ? JSON.parse(existing) : []
    feedbackList.push(feedbackData)
    localStorage.setItem("userFeedback", JSON.stringify(feedbackList))

    setSubmitted(true)
    setName("")
    setEmail("")
    setRating(0)
    setFeedback("")

    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-foreground">Safeπ</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">Share Your Feedback</h1>
          <p className="text-muted-foreground text-lg">
            Help us improve Safeπ by sharing your experience
          </p>
        </div>

        <Card className="p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Thank you!</h3>
              <p className="text-muted-foreground">Your feedback has been submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Rate Your Experience
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating ? "fill-warning text-warning" : "text-muted-foreground/50"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Feedback
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us about your experience using Safeπ..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={rating === 0}>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
