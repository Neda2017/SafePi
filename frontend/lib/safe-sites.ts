export interface SafeSite {
  url: string
  name: string
  type: "website" | "social"
  description: string
  verified: boolean
}

export const safeSites: SafeSite[] = [
  {
    url: "minepi.com",
    name: "Pi Network Official Website",
    type: "website",
    description: "Official Pi Network website and main portal",
    verified: true,
  },
  {
    url: "minepi.com/support",
    name: "Pi Network Support Portal",
    type: "website",
    description: "Official Pi Network customer support and help center",
    verified: true,
  },
  {
    url: "support.help.minepi.com",
    name: "Pi Network Support Portal",
    type: "website",
    description: "Official Pi Network customer support and help center",
    verified: true,
  },
  {
    url: "minepi.com/wiki",
    name: "Pi Network Community Wiki",
    type: "website",
    description: "Official Pi Network community knowledge base",
    verified: true,
  },
  {
    url: "twitter.com/PiCoreTeam",
    name: "Pi Core Team Twitter",
    type: "social",
    description: "Official Pi Network Twitter account (@PiCoreTeam)",
    verified: true,
  },
  {
    url: "x.com/PiCoreTeam",
    name: "Pi Core Team X",
    type: "social",
    description: "Official Pi Network X (Twitter) account (@PiCoreTeam)",
    verified: true,
  },
  {
    url: "t.me/PiAnnouncements",
    name: "Pi Network Telegram",
    type: "social",
    description: "Official Pi Network Telegram announcements channel",
    verified: true,
  },
  {
    url: "facebook.com/PiCoreTeam",
    name: "Pi Core Team Facebook",
    type: "social",
    description: "Official Pi Network Facebook page (@PiCoreTeam)",
    verified: true,
  },
  {
    url: "instagram.com/pi_network",
    name: "Pi Network Instagram",
    type: "social",
    description: "Official Pi Network Instagram account (@pi_network)",
    verified: true,
  },
  {
    url: "threads.net/@pi_network",
    name: "Pi Network Threads",
    type: "social",
    description: "Official Pi Network Threads account (@pi_network)",
    verified: true,
  },
  {
    url: "youtube.com/c/PiCoreTeam",
    name: "Pi Core Team YouTube",
    type: "social",
    description: "Official Pi Network YouTube channel",
    verified: true,
  },
  {
    url: "wallet.pinet.com",
    name: "Pi Network Wallet",
    type: "website",
    description: "Official Pi Network Wallet (accessible only via Pi Browser)",
    verified: true,
  },
]
