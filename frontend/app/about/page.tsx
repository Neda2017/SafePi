import type { Metadata } from "next"
import { Shield, Heart, Users, Target, Award, Mail } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Safeπ - Pi Network Security",
  description:
    "Learn about Safeπ, created by bill81 to protect the Pi Network community from scams, phishing, and fraudulent activities.",
  openGraph: {
    title: "About Safeπ - Pi Network Security",
    description: "Protecting the Pi Network community from scams and phishing with real-time threat detection",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
            ← Back to Home
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4">About Safeπ</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Protecting the Pi Network community from scams, phishing, and fraudulent activities
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex items-start gap-4">
            <Target className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Safeπ was created to protect Pi Network pioneers from the growing threat of scams, phishing websites,
                and fraudulent wallet addresses. As the Pi Network ecosystem grows, so do the attempts to exploit our
                community. Our mission is to provide real-time protection through community-powered threat intelligence
                and advanced detection algorithms.
              </p>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            What We Do
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">🔍 URL Scanning</h3>
                <p className="text-muted-foreground">
                  Instantly detect phishing websites, fake Pi wallets, and malicious links targeting Pi Network users.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">💰 Wallet Verification</h3>
                <p className="text-muted-foreground">
                  Check wallet addresses against our database of known scammers before sending Pi tokens.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">👥 Community Reports</h3>
                <p className="text-muted-foreground">
                  Leverage the power of the Pi community to identify and report new threats in real-time.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">📚 Security Education</h3>
                <p className="text-muted-foreground">
                  Learn how to identify scams, protect your Pi, and stay safe in the crypto ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">1,000+</div>
            <div className="text-muted-foreground">Scam Sites Detected</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">Real-time</div>
            <div className="text-muted-foreground">Threat Detection</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Community Protection</div>
          </div>
        </div>

        {/* Creator */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full flex-shrink-0">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Created by bill81</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Safeπ is developed and maintained by bill81, a dedicated member of the Pi Network community passionate
                about security and protecting fellow pioneers. With extensive experience in cybersecurity and blockchain
                technology, the goal is to create a safer ecosystem for all Pi users.
              </p>
              <p className="text-muted-foreground italic">
                "Every pioneer deserves to feel safe when using Pi Network. Safeπ is my contribution to making that a
                reality." - bill81
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            Our Values
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-lg">Community First:</strong>
                <span className="text-muted-foreground"> Everything we do is for the Pi Network community</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-lg">Transparency:</strong>
                <span className="text-muted-foreground"> Open about our methods and data sources</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-lg">Privacy:</strong>
                <span className="text-muted-foreground"> Your data is yours, stored locally and securely</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-lg">Innovation:</strong>
                <span className="text-muted-foreground"> Constantly improving our detection algorithms</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-lg">Accuracy:</strong>
                <span className="text-muted-foreground"> Rigorous verification of all threat reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Community */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex items-start gap-4">
            <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Safeπ is powered by pioneers like you. By reporting scams, sharing alerts, and educating others, you
                help protect the entire Pi Network ecosystem. Together, we can make Pi Network the safest blockchain
                community.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Start Scanning
                </Link>
                <Link
                  href="/education"
                  className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have questions, suggestions, or want to report a bug? We'd love to hear from you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
