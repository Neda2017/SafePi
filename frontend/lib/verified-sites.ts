export interface VerifiedSite {
  url: string
  name: string
  description: string
  category: "Official" | "Partner" | "Exchange" | "App" | "Service"
  verifiedDate: string
  badgeLevel: "gold" | "silver" | "bronze"
}

export const verifiedSites: VerifiedSite[] = [
  {
    url: "minepi.com",
    name: "Pi Network",
    description: "Official Pi Network website and app",
    category: "Official",
    verifiedDate: "2024-01-01",
    badgeLevel: "gold",
  },
  {
    url: "pinetwork.com",
    name: "Pi Network Info",
    description: "Official Pi Network information portal",
    category: "Official",
    verifiedDate: "2024-01-01",
    badgeLevel: "gold",
  },
  {
    url: "pi.app",
    name: "Pi Browser",
    description: "Official Pi Browser platform",
    category: "Official",
    verifiedDate: "2024-01-01",
    badgeLevel: "gold",
  },
  // Partner apps can be added here with silver/bronze badges
]

export function isVerifiedSite(url: string): VerifiedSite | null {
  const normalizedUrl = url.toLowerCase().replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
  
  return verifiedSites.find((site) => 
    normalizedUrl.includes(site.url.toLowerCase()) || 
    site.url.toLowerCase().includes(normalizedUrl)
  ) || null
}

export function getVerifiedBadge(url: string): { isVerified: boolean; badge: VerifiedSite | null } {
  const verified = isVerifiedSite(url)
  return {
    isVerified: verified !== null,
    badge: verified,
  }
}
