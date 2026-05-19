import { HelpCircle, Shield, AlertCircle, CheckCircle, Search, Wallet } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Help & FAQ</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Common questions about using Safeπ and staying safe on Pi Network
          </p>
        </div>

        {/* Getting Started */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            Getting Started
          </h2>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">What is Safeπ?</h3>
              <p className="text-muted-foreground">
                Safeπ is a security app for the Pi Network community that detects scam websites, phishing attempts, and
                fraudulent wallet addresses. It helps protect your Pi tokens and personal information from
                cybercriminals targeting Pi users.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How do I use Safeπ?</h3>
              <p className="text-muted-foreground mb-3">Using Safeπ is simple:</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>Copy any suspicious website URL or wallet address</li>
                <li>Paste it into the Safeπ scan box</li>
                <li>Click "Check URL" or "Check Wallet"</li>
                <li>Review the safety score and detailed analysis</li>
                <li>Follow the recommendations provided</li>
              </ol>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Do I need to sign in?</h3>
              <p className="text-muted-foreground">
                No! You can use basic scanning features without signing in. However, signing in with your Pi Network
                account gives you access to personalized features like scan history, favorites, and the ability to
                submit community reports.
              </p>
            </div>
          </div>
        </div>

        {/* URL Scanning */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            URL Scanning
          </h2>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">What URLs should I scan?</h3>
              <p className="text-muted-foreground mb-3">Scan any website before:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Entering your Pi wallet passphrase</li>
                <li>Providing personal information</li>
                <li>Connecting your Pi wallet</li>
                <li>Downloading any "Pi mining" software</li>
                <li>Clicking links from social media or emails</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">What do the trust scores mean?</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-20 font-semibold text-green-500">90-100:</div>
                  <div>Safe - Verified legitimate site</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-20 font-semibold text-blue-500">70-89:</div>
                  <div>Likely Safe - No major red flags detected</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-20 font-semibold text-yellow-500">40-69:</div>
                  <div>Suspicious - Exercise caution, verify independently</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-20 font-semibold text-orange-500">20-39:</div>
                  <div>Dangerous - High risk of scam, avoid</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-20 font-semibold text-red-500">0-19:</div>
                  <div>Critical Threat - Known scam, do not use</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Can Safeπ scan any website?</h3>
              <p className="text-muted-foreground">
                Yes! Safeπ can scan any URL. However, we specialize in detecting threats targeting the Pi Network
                community. For general websites, use additional verification methods.
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Checking */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            Wallet Address Checking
          </h2>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How do I check a wallet address?</h3>
              <p className="text-muted-foreground">
                Before sending Pi to any wallet, paste the address into the Wallet Checker tab. Safeπ will check it
                against our database of known scammer addresses and show you the risk level.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">What if a wallet shows as dangerous?</h3>
              <p className="text-muted-foreground mb-3">If a wallet is flagged as dangerous:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong>Do NOT send Pi to that address</strong>
                </li>
                <li>Report the scammer to Pi Network support</li>
                <li>Warn others in your community</li>
                <li>Check the report details for more information</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Can I report a scammer wallet?</h3>
              <p className="text-muted-foreground">
                Yes! If you've encountered a scam wallet, use the "Report This Site" feature to submit it to our
                database. Verified reports help protect the entire community.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Safety Tips
          </h2>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">How to stay safe on Pi Network</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Official sources only:</strong> Only use wallet.pinet.com via the official Pi Browser
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Never share passphrases:</strong> Pi Network will never ask for your 24-word passphrase
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Verify URLs:</strong> Check for typos and subtle domain variations
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Scan first:</strong> Use Safeπ before entering any sensitive information
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Be skeptical:</strong> If it promises free Pi or sounds too good to be true, it probably is
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Report scams:</strong> Help protect others by reporting threats you encounter
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-primary" />
            Troubleshooting
          </h2>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Safeπ says a site is dangerous, but I think it's safe</h3>
              <p className="text-muted-foreground">
                Our database is constantly updated, but false positives can occur. If you believe a site is incorrectly
                flagged, you can submit a review request through our community reporting system. Always err on the side
                of caution when dealing with your Pi tokens.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">The scan isn't working</h3>
              <p className="text-muted-foreground">
                Try these steps: 1) Refresh the page, 2) Clear your browser cache, 3) Make sure you're pasting a
                complete URL, 4) Check your internet connection. If issues persist, the site may be temporarily
                unavailable.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">My scan history disappeared</h3>
              <p className="text-muted-foreground">
                Scan history is stored locally in your browser. If you cleared your browser data or switched devices,
                your history will be reset. Sign in with Pi Network to sync your history across devices.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Visit our{" "}
            <Link href="/education" className="text-primary hover:underline">
              Security Education Center
            </Link>{" "}
            for more detailed guides, or contact us through the Pi Network app platform.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Start Scanning Now
          </Link>
        </div>
      </div>
    </div>
  )
}
