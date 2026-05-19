import type { Metadata } from "next"
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service - Safeπ",
  description:
    "Read the Terms of Service for Safeπ, the Pi Network security app that protects you from scams and phishing.",
  openGraph: {
    title: "Terms of Service - Safeπ",
    description: "Terms of Service for Safeπ - Pi Network Security App",
    type: "website",
  },
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Safeπ, you agree to be bound by these Terms of Service and all applicable laws and
              regulations. If you do not agree with any of these terms, you are prohibited from using this application.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              Safeπ provides security and scam detection services for the Pi Network community, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>URL and website scanning for phishing and scam detection</li>
              <li>Wallet address verification against known scammer databases</li>
              <li>Community-powered threat reporting</li>
              <li>Security education and awareness</li>
              <li>Real-time threat intelligence</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Acceptable Use
            </h2>
            <p className="text-muted-foreground mb-4">
              You agree to use Safeπ only for lawful purposes. You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Submit false or misleading scam reports</li>
              <li>Attempt to bypass security measures or rate limits</li>
              <li>Use the service to harass, defame, or harm others</li>
              <li>Reverse engineer or copy the threat database</li>
              <li>Automate requests without permission</li>
              <li>Redistribute or resell access to the service</li>
              <li>Use the service for any illegal activities</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Pi Network Integration</h2>
            <p className="text-muted-foreground mb-4">By connecting your Pi Network account, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Comply with Pi Network's Terms of Service and Community Guidelines</li>
              <li>Provide accurate authentication information</li>
              <li>Maintain the security of your Pi Network credentials</li>
              <li>Use wallet verification features responsibly</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Community Reports</h2>
            <p className="text-muted-foreground mb-4">When submitting reports of scam sites or wallets:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Ensure reports are accurate and truthful</li>
              <li>Provide evidence when available</li>
              <li>Do not submit false or malicious reports</li>
              <li>Understand that reports become part of our public database</li>
              <li>Your Pi username may be associated with your reports</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to review, moderate, and remove reports that violate these terms.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              Disclaimers and Limitations
            </h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">No Guarantee</h3>
            <p className="text-muted-foreground">
              While we strive for accuracy, Safeπ does not guarantee that all scam sites or wallets will be detected.
              Use your own judgment and always verify independently before sending Pi tokens or entering sensitive
              information.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Service Availability</h3>
            <p className="text-muted-foreground">
              We provide the service "as is" without warranties of any kind. We do not guarantee uninterrupted or
              error-free service and may modify or discontinue features at any time.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Limitation of Liability</h3>
            <p className="text-muted-foreground">
              Safeπ and its creator (bill81) shall not be liable for any damages arising from your use of the service,
              including but not limited to loss of Pi tokens, financial losses, or security breaches.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">User Accounts and Data</h2>
            <p className="text-muted-foreground mb-4">You are responsible for:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Maintaining the security of your Pi Network account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us of unauthorized access</li>
              <li>Backing up your local data (scan history, favorites)</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground">
              The Safeπ application, including its code, design, threat database, and content, is owned by bill81. You
              may not copy, modify, distribute, or create derivative works without explicit permission.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              Termination
            </h2>
            <p className="text-muted-foreground">
              We reserve the right to terminate or suspend your access to Safeπ at any time, without notice, for conduct
              that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              Governing Law
            </h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be
              resolved through good faith negotiation or, if necessary, through appropriate legal channels.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify users of material changes by
              updating the "Last updated" date and posting a notice in the app. Continued use after changes constitutes
              acceptance of the modified Terms.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, please contact us through the Pi Network app platform.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>App Name:</strong> Safeπ
              <br />
              <strong>Developer:</strong> bill81
              <br />
              <strong>Platform:</strong> Pi Network
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
