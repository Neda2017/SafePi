"use client"

import { AlertTriangle, TrendingUp, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentReports = [
  {
    url: "claim314pitoken.com/wallet/",
    type: "Phony Wallet",
    reports: 2847,
    time: "15 mins ago",
    severity: "high",
  },
  {
    url: "2fa-pinet.com/2fa",
    type: "Fake 2FA",
    reports: 2634,
    time: "22 mins ago",
    severity: "high",
  },
  {
    url: "stakepinet.com/wallet.php",
    type: "Fake Staking",
    reports: 2456,
    time: "35 mins ago",
    severity: "high",
  },
  {
    url: "pinetworkp2p.vercel.app/wallet",
    type: "Fake P2P Market",
    reports: 2289,
    time: "48 mins ago",
    severity: "high",
  },
  {
    url: "pi2fa.com/wallet",
    type: "Fake 2FA",
    reports: 2134,
    time: "1 hour ago",
    severity: "high",
  },
  {
    url: "pi-airdrop.net/wallet.html",
    type: "Giveaway Scam",
    reports: 1987,
    time: "1 hour ago",
    severity: "high",
  },
  {
    url: "event400pinet.com/login",
    type: "Fake Login",
    reports: 1823,
    time: "2 hours ago",
    severity: "high",
  },
  {
    url: "rewardspi.com/wallet",
    type: "Giveaway Scam",
    reports: 1756,
    time: "2 hours ago",
    severity: "high",
  },
  {
    url: "verify--pi.web.app/",
    type: "Fake Verification",
    reports: 1689,
    time: "3 hours ago",
    severity: "high",
  },
  {
    url: "piconvert.net/unlock wallet",
    type: "Phony Wallet",
    reports: 1567,
    time: "3 hours ago",
    severity: "high",
  },
  {
    url: "baomatpi.icu/",
    type: "Fake Login",
    reports: 1489,
    time: "4 hours ago",
    severity: "high",
  },
  {
    url: "rewardpi.net/",
    type: "Giveaway Scam",
    reports: 1423,
    time: "4 hours ago",
    severity: "high",
  },
  {
    url: "pinet2fa.net/home",
    type: "Fake 2FA",
    reports: 1367,
    time: "5 hours ago",
    severity: "high",
  },
  {
    url: "pi-airdrop-claim.com/",
    type: "Giveaway Scam",
    reports: 1298,
    time: "5 hours ago",
    severity: "high",
  },
  {
    url: "piledger.live/wallet/",
    type: "Phony Wallet",
    reports: 1234,
    time: "6 hours ago",
    severity: "high",
  },
  {
    url: "pinet-unlock.com/",
    type: "Phony Wallet",
    reports: 1178,
    time: "6 hours ago",
    severity: "high",
  },
  {
    url: "pip2pbrowser.com/activate-wallet",
    type: "Fake P2P Market",
    reports: 1123,
    time: "7 hours ago",
    severity: "high",
  },
  {
    url: "searchp2p.digital/keyphrase.php",
    type: "Fake P2P Market",
    reports: 1089,
    time: "7 hours ago",
    severity: "high",
  },
  {
    url: "pinetwork-claim.com/wallet.html",
    type: "Giveaway Scam",
    reports: 1045,
    time: "8 hours ago",
    severity: "high",
  },
  {
    url: "pistake.net/wallet",
    type: "Fake Staking",
    reports: 998,
    time: "8 hours ago",
    severity: "high",
  },
  {
    url: "2fapinet.com/",
    type: "Fake 2FA",
    reports: 967,
    time: "9 hours ago",
    severity: "high",
  },
  {
    url: "stakepi2day.com/wallet.php",
    type: "Fake Staking",
    reports: 934,
    time: "9 hours ago",
    severity: "high",
  },
  {
    url: "day2pi.us/",
    type: "Giveaway Scam",
    reports: 889,
    time: "10 hours ago",
    severity: "high",
  },
  {
    url: "piclaim354.website/claim/",
    type: "Giveaway Scam",
    reports: 856,
    time: "10 hours ago",
    severity: "high",
  },
  {
    url: "piwallet.help/",
    type: "Phony Wallet",
    reports: 823,
    time: "11 hours ago",
    severity: "high",
  },
  {
    url: "pitwoday.com/login",
    type: "Fake Login",
    reports: 789,
    time: "11 hours ago",
    severity: "medium",
  },
  {
    url: "pigiggle.com/",
    type: "Fake P2P Market",
    reports: 756,
    time: "12 hours ago",
    severity: "medium",
  },
  {
    url: "p2p-market.vercel.app/",
    type: "Fake P2P Market",
    reports: 734,
    time: "12 hours ago",
    severity: "medium",
  },
  {
    url: "pi2fauth.com/",
    type: "Fake 2FA",
    reports: 698,
    time: "13 hours ago",
    severity: "medium",
  },
  {
    url: "pi-airdrop.online/wallet.html",
    type: "Giveaway Scam",
    reports: 667,
    time: "13 hours ago",
    severity: "medium",
  },
  {
    url: "mainnetbroswer.com/",
    type: "Fake Browser",
    reports: 645,
    time: "14 hours ago",
    severity: "medium",
  },
  {
    url: "giftwork2025.com/",
    type: "Giveaway Scam",
    reports: 623,
    time: "14 hours ago",
    severity: "medium",
  },
  {
    url: "pinetnetwork.world/",
    type: "Fake Login",
    reports: 598,
    time: "15 hours ago",
    severity: "medium",
  },
  {
    url: "pi-p2p.com/pi-wallet/",
    type: "Fake P2P Market",
    reports: 576,
    time: "15 hours ago",
    severity: "medium",
  },
  {
    url: "claim500picoin.com/home/wallet.php",
    type: "Giveaway Scam",
    reports: 554,
    time: "16 hours ago",
    severity: "medium",
  },
  {
    url: "pinetwork-browsers.com/6thpi",
    type: "Fake Browser",
    reports: 532,
    time: "16 hours ago",
    severity: "medium",
  },
  {
    url: "tradep2ppinetwork.com/public/unlock",
    type: "Scam Exchange",
    reports: 509,
    time: "17 hours ago",
    severity: "medium",
  },
  {
    url: "peerpaypinet.com/public/unlock",
    type: "Fake P2P Market",
    reports: 487,
    time: "17 hours ago",
    severity: "medium",
  },
  {
    url: "pinetwork-event.com/birthday",
    type: "Giveaway Scam",
    reports: 465,
    time: "18 hours ago",
    severity: "medium",
  },
  {
    url: "pionergift.com/9-2/",
    type: "Giveaway Scam",
    reports: 443,
    time: "18 hours ago",
    severity: "medium",
  },
  {
    url: "pinet-wallet.web.app/authenticate",
    type: "Phony Wallet",
    reports: 421,
    time: "19 hours ago",
    severity: "medium",
  },
  {
    url: "confirmpi.web.app/wallet.html",
    type: "Phony Wallet",
    reports: 398,
    time: "19 hours ago",
    severity: "medium",
  },
  {
    url: "unlockpiinfo.xyz/phrase/",
    type: "Phony Wallet",
    reports: 376,
    time: "20 hours ago",
    severity: "medium",
  },
  {
    url: "pinetp2pfeature.com/public/unlock",
    type: "Fake P2P Market",
    reports: 354,
    time: "20 hours ago",
    severity: "medium",
  },
  {
    url: "activatepi2day.net/wallet.php",
    type: "Giveaway Scam",
    reports: 332,
    time: "21 hours ago",
    severity: "medium",
  },
  {
    url: "pinet-token2049.com/",
    type: "Fake Event",
    reports: 310,
    time: "21 hours ago",
    severity: "medium",
  },
  {
    url: "wallet-pinnetwork.com/wallet2",
    type: "Phony Wallet",
    reports: 289,
    time: "22 hours ago",
    severity: "medium",
  },
  {
    url: "pionermarket.com/9-2/",
    type: "Fake P2P Market",
    reports: 267,
    time: "22 hours ago",
    severity: "low",
  },
  {
    url: "pi-airdrop.network/wallet2.html",
    type: "Giveaway Scam",
    reports: 245,
    time: "23 hours ago",
    severity: "low",
  },
  {
    url: "picore1.com/wallet.html",
    type: "Phony Wallet",
    reports: 223,
    time: "23 hours ago",
    severity: "low",
  },
]

export function CommunityReports() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Community Reports</h3>
            <p className="text-sm text-muted-foreground">Real-time threats reported by users worldwide</p>
          </div>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background border border-border">
            <div className="text-2xl font-bold text-foreground mb-1">1,247</div>
            <div className="text-xs text-muted-foreground">Reports Today</div>
          </div>
          <div className="p-3 rounded-lg bg-background border border-border">
            <div className="text-2xl font-bold text-foreground mb-1">89K</div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </div>
        </div>
      </Card>

      {/* Recent Reports */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground px-1">Recent Threats</h4>
        {recentReports.map((report, index) => (
          <Card key={index} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle
                    className={`w-4 h-4 ${report.severity === "high" ? "text-destructive" : "text-warning"}`}
                  />
                  <span className="font-mono text-sm text-foreground">{report.url}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {report.time}
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  report.severity === "high"
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-warning/10 text-warning border-warning/20"
                }
              >
                {report.type}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">{report.reports} reports</span>
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Report Button */}
      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Report a Threat</Button>
    </div>
  )
}
