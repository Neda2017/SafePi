import type { Metadata } from "next"
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy - Safeπ",
  description:
    "Learn how Safeπ protects your privacy while keeping you safe from Pi Network scams and phishing attempts.",
  openGraph: {
    title: "Privacy Policy - Safeπ",
    description: "Learn how Safeπ protects your privacy while keeping you safe from Pi Network scams.",
    type: "website",
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              Introduction
            </h2>
            <p className="text-muted-foreground">
              Safeπ is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and
              safeguard your information when you use our scam detection and security application.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              Information We Collect
            </h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Pi Network Authentication:</strong> When you sign in with Pi Network, we receive your username
                and Pi user ID
              </li>
              <li>
                <strong>Scan History:</strong> URLs and wallet addresses you scan are stored locally in your browser
              </li>
              <li>
                <strong>Community Reports:</strong> Sites and wallets you report, along with your Pi username if
                authenticated
              </li>
              <li>
                <strong>Favorites:</strong> Sites you mark as trusted are stored locally
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Usage Data:</strong> Pages visited, features used, and interaction patterns
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating system, screen resolution
              </li>
              <li>
                <strong>Performance Data:</strong> App load times and error logs
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Provide scam detection and security services</li>
              <li>Personalize your experience with scan history and favorites</li>
              <li>Process community reports and maintain threat databases</li>
              <li>Verify wallet ownership through Pi Network integration</li>
              <li>Improve app performance and user experience</li>
              <li>Detect and prevent fraudulent activity</li>
              <li>Communicate security alerts and updates</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-primary" />
              Data Storage and Security
            </h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Local Storage:</strong> Scan history and favorites are stored locally in your browser
              </li>
              <li>
                <strong>Encryption:</strong> All data transmissions use HTTPS encryption
              </li>
              <li>
                <strong>Pi SDK:</strong> Authentication is handled securely through Pi Network's official SDK
              </li>
              <li>
                <strong>No Passwords:</strong> We never store or have access to your Pi Network password or wallet
                passphrase
              </li>
              <li>
                <strong>Data Minimization:</strong> We only collect data necessary for app functionality
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">Safeπ integrates with the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Pi Network:</strong> For authentication and wallet verification (governed by Pi Network's
                Privacy Policy)
              </li>
              <li>
                <strong>Vercel:</strong> For hosting and deployment
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Access:</strong> View all data we have about you
              </li>
              <li>
                <strong>Delete:</strong> Clear your scan history and favorites at any time
              </li>
              <li>
                <strong>Opt-Out:</strong> Disconnect Pi Network authentication
              </li>
              <li>
                <strong>Export:</strong> Download your data in common formats
              </li>
              <li>
                <strong>Correct:</strong> Update any inaccurate information
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-muted-foreground">
              Local data (scan history, favorites) is retained until you clear it. Community reports are retained to
              maintain the threat database. You can delete your account and all associated data by contacting us.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-primary" />
              Changes to This Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by updating
              the "Last updated" date and posting a notice in the app.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy or your data, please contact:
            </p>
            <p className="text-muted-foreground">
              <strong>Developer:</strong> bill81
              <br />
              <strong>App:</strong> Safeπ - Pi Network Security
              <br />
              <strong>Support:</strong> Contact through Pi Network app platform
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
