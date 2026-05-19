"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Alex Chen",
    username: "@alexc_pioneer",
    text: "Safeπ saved me from a fake wallet site. This app is essential for every Pi Network user!",
    rating: 5,
  },
  {
    name: "Maria Santos",
    username: "@maria_pi",
    text: "Love the real-time threat detection. Finally feel safe navigating Pi-related sites.",
    rating: 5,
  },
  {
    name: "John Miller",
    username: "@jmiller_crypto",
    text: "The community reporting feature is brilliant. We're all protecting each other!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <div className="mt-12 mb-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">Trusted by Pi Pioneers</h3>
        <p className="text-muted-foreground">See what our community says about staying safe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-sm text-foreground mb-4 leading-relaxed">{testimonial.text}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{testimonial.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.username}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
