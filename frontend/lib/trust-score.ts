import { scamDatabase } from "./scam-database"
import { safeSites } from "./safe-sites"

export interface TrustScoreResult {
  score: number
  level: "excellent" | "good" | "moderate" | "poor" | "dangerous"
  threatLabel: "SAFE" | "SUSPICIOUS" | "FAKE SITE" | "PHISHING" | "SCAM" | "DANGEROUS"
  factors: Array<{
    name: string
    impact: "positive" | "negative" | "neutral"
    description: string
  }>
  detectedPatterns: string[]
}

const suspiciousTLDs = [
  ".tk",
  ".ml",
  ".ga",
  ".cf",
  ".gq",
  ".top",
  ".icu",
  ".xyz",
  ".club",
  ".work",
  ".site",
  ".online",
  ".live",
  ".us",
  ".my.id",
  ".web.id",
  ".icu",
  ".fwh.is",
]

const suspiciousKeywords = [
  "claim",
  "free",
  "airdrop",
  "gift",
  "unlock",
  "wallet",
  "2fa",
  "kyc",
  "verify",
  "reward",
  "bonus",
  "giveaway",
  "event",
  "migration",
  "swap",
  "stake",
  "earn",
  "prize",
  "winner",
  "drop",
  "key",
  "passphrase",
  "seed",
  "mnemonic",
  "recovery",
]

// Patterns that are ALWAYS critical regardless of other factors
const alwaysDangerousPatterns = [
  "2fapinetkey",
  "2fapinet",
  "pinetkey",
  "pinetdrop",
  "pidrop",
  "piclaimairdrop",
  "sellpinetwork",
  "pinetwork-kyc",
  "pinetwork-migration",
  "pinetwork-dex",
  "pinetwork-gift",
  "pinetwork-support",
  "pinetwork-verify",
  "pinetwork-help",
  "fakepidex",
  "pinetworkkyc",
  "chuyendoinetpi",
  "piwalletdrop",
]

const officialDomains = ["minepi.com", "pi.network", "wallet.pi.net"]

export function calculateTrustScore(url: string): TrustScoreResult {
  let score = 50
  const factors: TrustScoreResult["factors"] = []
  const detectedPatterns: string[] = []

  const normalizedUrl = url
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .replace(/^www\./, "")

  const isOfficial = safeSites.some(
    (site) => normalizedUrl.includes(site.url.toLowerCase()) || site.url.toLowerCase().includes(normalizedUrl),
  )

  if (isOfficial) {
    score = 100
    factors.push({
      name: "Official Pi Network Site",
      impact: "positive",
      description: "Verified official Pi Network domain",
    })
    return { score, level: "excellent", threatLabel: "SAFE", factors, detectedPatterns }
  }

  // Check always-dangerous patterns first (before database lookup)
  const matchedDangerousPattern = alwaysDangerousPatterns.find((pattern) =>
    normalizedUrl.includes(pattern)
  )
  if (matchedDangerousPattern) {
    factors.push({
      name: "Known Scam Pattern Detected",
      impact: "negative",
      description: `URL matches a confirmed Pi Network scam pattern: "${matchedDangerousPattern}"`,
    })
    detectedPatterns.push(`Scam pattern: ${matchedDangerousPattern}`)
    return { score: 0, level: "dangerous", threatLabel: "PHISHING", factors, detectedPatterns }
  }

  // Extract just the domain from the input URL for matching
  const normalizedDomain = normalizedUrl.split("/")[0]

  const exactMatch = scamDatabase.find((scam) => {
    const scamNormalized = scam.url
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .replace(/^www\./, "")

    const scamDomain = scamNormalized.split("/")[0]

    const matches =
      // Exact full URL match
      scamNormalized === normalizedUrl ||
      // Domain-only match (catches trailing slash, extra paths etc.)
      scamDomain === normalizedDomain ||
      // Input URL contains scam URL
      normalizedUrl.includes(scamNormalized) ||
      // Scam URL contains input URL
      scamNormalized.includes(normalizedUrl) ||
      // Domain-level contains match
      normalizedDomain.includes(scamDomain) ||
      scamDomain.includes(normalizedDomain)

    return matches
  })

  if (exactMatch) {
    score = 0
    factors.push({
      name: "Known Scam Site",
      impact: "negative",
      description: `Reported ${exactMatch.reports} times as ${exactMatch.type}`,
    })
    detectedPatterns.push(`Known ${exactMatch.type}`)

    let threatLabel: TrustScoreResult["threatLabel"] = "DANGEROUS"
    const scamType = exactMatch.type.toLowerCase()

    if (scamType.includes("phishing") || scamType.includes("wallet")) {
      threatLabel = "PHISHING"
    } else if (scamType.includes("fake") || scamType.includes("impersonat")) {
      threatLabel = "FAKE SITE"
    } else if (scamType.includes("scam") || scamType.includes("fraud") || scamType.includes("airdrop")) {
      threatLabel = "SCAM"
    }

    return { score, level: "dangerous", threatLabel, factors, detectedPatterns }
  }

  const hasSuspiciousTLD = suspiciousTLDs.some(
    (tld) => normalizedUrl.endsWith(tld) || normalizedUrl.includes(tld + "/"),
  )
  if (hasSuspiciousTLD) {
    score -= 20
    factors.push({
      name: "Suspicious Domain Extension",
      impact: "negative",
      description: "Uses a domain extension commonly associated with scams",
    })
    detectedPatterns.push("Suspicious TLD")
  } else {
    score += 10
    factors.push({
      name: "Standard Domain Extension",
      impact: "positive",
      description: "Uses a reputable domain extension",
    })
  }

  const hasHttps = url.toLowerCase().startsWith("https://")
  if (hasHttps) {
    score += 15
    factors.push({
      name: "Secure Connection",
      impact: "positive",
      description: "Website uses HTTPS encryption",
    })
  } else {
    score -= 15
    factors.push({
      name: "No Secure Connection",
      impact: "negative",
      description: "Website does not use HTTPS encryption",
    })
    detectedPatterns.push("No HTTPS")
  }

  const foundKeywords = suspiciousKeywords.filter((keyword) => normalizedUrl.includes(keyword))
  if (foundKeywords.length > 0 && normalizedUrl.includes("pi")) {
    score -= 25
    factors.push({
      name: "Suspicious Keywords",
      impact: "negative",
      description: `URL contains keywords commonly used in Pi Network scams: ${foundKeywords.slice(0, 3).join(", ")}`,
    })
    detectedPatterns.push(`Suspicious keywords: ${foundKeywords.slice(0, 3).join(", ")}`)
  }

  const hyphenCount = (normalizedUrl.match(/-/g) || []).length
  const numberCount = (normalizedUrl.match(/\d/g) || []).length
  if (hyphenCount > 3 || numberCount > 5) {
    score -= 10
    factors.push({
      name: "Unusual URL Pattern",
      impact: "negative",
      description: "URL contains excessive hyphens or numbers",
    })
    detectedPatterns.push("Excessive hyphens/numbers")
  }

  const urlDomain = normalizedUrl.split("/")[0]
  for (const officialDomain of officialDomains) {
    const distance = levenshteinDistance(urlDomain, officialDomain)
    if (distance > 0 && distance < 5) {
      score -= 30
      factors.push({
        name: "Typosquatting Detected",
        impact: "negative",
        description: `Domain is very similar to official ${officialDomain}`,
      })
      detectedPatterns.push(`Typosquatting: similar to ${officialDomain}`)
      break
    }
  }

  const similarScams = scamDatabase.filter((scam) => {
    const scamDomain = scam.url
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, "")
      .split("/")[0]
    const urlDomain = normalizedUrl.split("/")[0]
    return levenshteinDistance(scamDomain, urlDomain) < 5
  })

  if (similarScams.length > 0) {
    score -= 20
    factors.push({
      name: "Similar to Known Scams",
      impact: "negative",
      description: `Domain is similar to ${similarScams.length} known scam sites`,
    })
    detectedPatterns.push(`Similar to ${similarScams.length} known scams`)
  }

  if (/[^\x00-\x7F]/.test(normalizedUrl)) {
    score -= 25
    factors.push({
      name: "Unicode Characters Detected",
      impact: "negative",
      description: "URL contains non-ASCII characters that may be used for impersonation",
    })
    detectedPatterns.push("Unicode/homograph attack")
  }

  const suspiciousPaths = ["/wallet", "/login", "/verify", "/claim", "/unlock", "/2fa", "/kyc", "/passphrase"]
  const hasSuspiciousPath = suspiciousPaths.some((path) => normalizedUrl.includes(path))
  if (hasSuspiciousPath && normalizedUrl.includes("pi")) {
    score -= 15
    factors.push({
      name: "Suspicious URL Path",
      impact: "negative",
      description: "URL path commonly used in phishing attacks",
    })
    detectedPatterns.push("Suspicious path pattern")
  }

  score = Math.max(0, Math.min(100, score))

  let level: TrustScoreResult["level"]
  let threatLabel: TrustScoreResult["threatLabel"]

  if (score >= 80) {
    level = "excellent"
    threatLabel = "SAFE"
  } else if (score >= 60) {
    level = "good"
    threatLabel = "SAFE"
  } else if (score >= 40) {
    level = "moderate"
    threatLabel = "SUSPICIOUS"
  } else if (score >= 20) {
    level = "poor"
    threatLabel = "SUSPICIOUS"
  } else {
    level = "dangerous"
    threatLabel = "DANGEROUS"
  }

  return { score, level, threatLabel, factors, detectedPatterns }
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}
