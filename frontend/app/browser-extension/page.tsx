"use client"

import { useState } from "react"
import { Chrome, Download, CheckCircle, Code, AlertTriangle, Zap, Lock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BrowserExtensionPage() {
  const [copied, setCopied] = useState(false)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const manifestCode = `{
  "manifest_version": 3,
  "name": "Safeπ Protection",
  "version": "1.0.0",
  "description": "Real-time Pi Network scam detection",
  "permissions": ["activeTab", "storage", "notifications"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    }
  }
}`

  const backgroundCode = `// background.js - Checks URLs against Safeπ API
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkURL(tab.url, tabId);
  }
});

async function checkURL(url, tabId) {
  try {
    const response = await fetch(
      \`https://your-app.vercel.app/api/check-url?url=\${encodeURIComponent(url)}\`
    );
    const data = await response.json();
    
    if (!data.isSafe) {
      // Show warning notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: '⚠️ Dangerous Site Detected!',
        message: \`This site is flagged as: \${data.threatLabel}\`,
        priority: 2
      });
      
      // Update badge
      chrome.action.setBadgeText({ text: '⚠️', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4444', tabId });
    } else {
      chrome.action.setBadgeText({ text: '✓', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId });
    }
  } catch (error) {
    console.error('Safeπ check failed:', error);
  }
}`

  const contentCode = `// content.js - Injects warning overlay on dangerous sites
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'showWarning') {
    showWarningOverlay(message.data);
  }
});

function showWarningOverlay(data) {
  const overlay = document.createElement('div');
  overlay.style.cssText = \`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
  \`;
  
  overlay.innerHTML = \`
    <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 500px; text-align: center;">
      <h1 style="color: #ef4444; font-size: 2rem; margin-bottom: 1rem;">⚠️ DANGER</h1>
      <p style="color: #374151; font-size: 1.2rem; margin-bottom: 1rem;">\${data.threatLabel} DETECTED</p>
      <p style="color: #6b7280; margin-bottom: 2rem;">\${data.reason}</p>
      <button onclick="window.history.back()" style="background: #ef4444; color: white; padding: 0.75rem 2rem; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem;">
        Go Back to Safety
      </button>
    </div>
  \`;
  
  document.body.appendChild(overlay);
}`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-orange-500/10 to-red-500/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-orange-500/20 px-4 py-2 rounded-full mb-6">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-semibold text-orange-500">BROWSER EXTENSION</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Automatic Protection
              <br />
              <span className="text-orange-500">While You Browse</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Get real-time warnings about dangerous sites automatically. No manual checking needed.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold mb-2">Instant Warnings</h3>
            <p className="text-sm text-muted-foreground">
              Alerts appear the moment you visit a suspicious site - no delay
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold mb-2">970+ Scam Database</h3>
            <p className="text-sm text-muted-foreground">Access to our comprehensive Pi Network scam database</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
              <Chrome className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold mb-2">All Browsers</h3>
            <p className="text-sm text-muted-foreground">Works with Chrome, Firefox, Edge, and Brave</p>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-orange-500" />
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Extension Monitors Your Browsing</h3>
                <p className="text-sm text-muted-foreground">
                  Runs quietly in the background, checking every page you visit
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Checks Against Our Database</h3>
                <p className="text-sm text-muted-foreground">Sends URL to Safeπ API for instant threat analysis</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Shows Warning If Dangerous</h3>
                <p className="text-sm text-muted-foreground">
                  Displays full-screen alert with threat details and option to go back
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Badge Shows Status</h3>
                <p className="text-sm text-muted-foreground">
                  Green checkmark for safe sites, red warning for dangerous ones
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Build Instructions */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Code className="w-6 h-6 text-orange-500" />
            Build Your Extension
          </h2>

          <Tabs defaultValue="manifest">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="manifest">manifest.json</TabsTrigger>
              <TabsTrigger value="background">background.js</TabsTrigger>
              <TabsTrigger value="content">content.js</TabsTrigger>
            </TabsList>

            <TabsContent value="manifest">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{manifestCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCode(manifestCode)}
                  className="absolute top-2 right-2"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="background">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{backgroundCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCode(backgroundCode)}
                  className="absolute top-2 right-2"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="content">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{contentCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCode(contentCode)}
                  className="absolute top-2 right-2"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm mb-1">Update API URL</p>
                <p className="text-sm text-muted-foreground">
                  Replace <code className="bg-muted px-1 py-0.5 rounded">your-app.vercel.app</code> with your actual
                  Safeπ deployment URL in background.js
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Installation Steps */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Download className="w-6 h-6 text-orange-500" />
            Install Extension (Chrome)
          </h2>
          <ol className="space-y-4 list-decimal list-inside">
            <li className="text-muted-foreground">
              Create a folder called <code className="bg-muted px-2 py-1 rounded">safepi-extension</code>
            </li>
            <li className="text-muted-foreground">
              Save the three code files (manifest.json, background.js, content.js) in that folder
            </li>
            <li className="text-muted-foreground">
              Open Chrome and go to <code className="bg-muted px-2 py-1 rounded">chrome://extensions/</code>
            </li>
            <li className="text-muted-foreground">Enable "Developer mode" in the top right</li>
            <li className="text-muted-foreground">Click "Load unpacked" and select your extension folder</li>
            <li className="text-muted-foreground">The extension will now protect you automatically!</li>
          </ol>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
            <a href="/">← Back to Scanner</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
