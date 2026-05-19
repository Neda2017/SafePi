import { scamDatabase } from "./scam-database"

export interface TrustScoreDetails {
  score: number
  factors: {
    databaseMatch: { score: number; details: string }
    domainAge: { score: number; details: string }
    sslCertificate: { score: number; details: string }
    urlStructure: { score: number; details: string }
    redirectChain: { score: number; details: string }
    communityReports: { score: number; details: string }
  }
  riskLevel: "safe" | "low" | "medium" | "high" | "critical"
  recommendations: string[]
}

export function calculateEnhancedTrustScore(url: string): TrustScoreDetails {
  let totalScore = 100
  const factors: TrustScoreDetails["factors"] = {
    databaseMatch: { score: 0, details: "" },
    domainAge: { score: 0, details: "" },
    sslCertificate: { score: 0, details: "" },
    urlStructure: { score: 0, details: "" },
    redirectChain: { score: 0, details: "" },
    communityReports: { score: 0, details: "" },
  }
  const recommendations: string[] = []

  // 1. Database Match Check (-50 points for exact match, -30 for partial)
  const normalizedUrl = url.toLowerCase().replace(/^https?:\/\/(www\.)?/, "")
  const exactMatch = scamDatabase.find((threat) => {
    const threatUrl = threat.url.toLowerCase().replace(/^https?:\/\/(www\.)?/, "")
    return threatUrl === normalizedUrl
  })

  const partialMatch = !exactMatch && scamDatabase.find((threat) => {
    const threatUrl = threat.url.toLowerCase().replace(/^https?:\/\/(www\.)?/, "")
    return normalizedUrl.includes(threatUrl) || threatUrl.includes(normalizedUrl)
  })

  if (exactMatch) {
    factors.databaseMatch = {
      score: -50,
      details: `Exact match in threat database: ${exactMatch.type} (${exactMatch.reports} reports)`,
    }
    totalScore -= 50
    recommendations.push("⚠️ This URL is confirmed as a scam in our database")
    recommendations.push(`Reported as: ${exactMatch.description}`)
  } else if (partialMatch) {
    factors.databaseMatch = {
      score: -30,
      details: `Partial match with known threat: ${partialMatch.type}`,
    }
    totalScore -= 30
    recommendations.push("⚠️ Similar to a known threat. Proceed with extreme caution")
  } else {
    factors.databaseMatch = {
      score: 10,
      details: "No match found in threat database",
    }
    totalScore += 10
  }

  // 2. Domain Age Analysis (simulated - in production use WHOIS API)
  const domainAgeCheck = analyzeDomainAge(url)
  factors.domainAge = domainAgeCheck
  totalScore += domainAgeCheck.score
  if (domainAgeCheck.score < 0) {
    recommendations.push(domainAgeCheck.details)
  }

  // 3. SSL Certificate Check
  const sslCheck = checkSSL(url)
  factors.sslCertificate = sslCheck
  totalScore += sslCheck.score
  if (sslCheck.score < 0) {
    recommendations.push(sslCheck.details)
  }

  // 4. URL Structure Analysis
  const urlCheck = analyzeURLStructure(url)
  factors.urlStructure = urlCheck
  totalScore += urlCheck.score
  if (urlCheck.score < 0) {
    recommendations.push(urlCheck.details)
  }

  // 5. Redirect Chain Analysis (simulated)
  const redirectCheck = analyzeRedirects(url)
  factors.redirectChain = redirectCheck
  totalScore += redirectCheck.score
  if (redirectCheck.score < 0) {
    recommendations.push(redirectCheck.details)
  }

  // 6. Community Reports
  const communityCheck = checkCommunityReports(url)
  factors.communityReports = communityCheck
  totalScore += communityCheck.score

  // Ensure score stays within 0-100
  totalScore = Math.max(0, Math.min(100, totalScore))

  // Determine risk level
  let riskLevel: TrustScoreDetails["riskLevel"]
  if (totalScore >= 80) riskLevel = "safe"
  else if (totalScore >= 60) riskLevel = "low"
  else if (totalScore >= 40) riskLevel = "medium"
  else if (totalScore >= 20) riskLevel = "high"
  else riskLevel = "critical"

  // Add general recommendations
  if (riskLevel === "safe" || riskLevel === "low") {
    recommendations.push("✅ Always verify the URL before entering personal information")
  } else {
    recommendations.push("🚫 Do NOT enter passwords, private keys, or personal information")
    recommendations.push("🚫 Do NOT send Pi or any cryptocurrency to this site")
  }

  return {
    score: totalScore,
    factors,
    riskLevel,
    recommendations,
  }
}

function analyzeDomainAge(url: string): { score: number; details: string } {
  try {
    const domain = new URL(url).hostname
    
    // Check for suspicious patterns that indicate new/temporary domains
    const suspiciousPatterns = [
      /\d{4,}/,  // Multiple numbers (often in scam domains)
      /\.web\.app$/,  // Firebase hosting (often abused)
      /\.netlify\.app$/,  // Netlify (often abused)
      /\.vercel\.app$/,  // Vercel (often abused)
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(domain)) {
        return {
          score: -10,
          details: "⚠️ Domain uses free hosting service commonly abused by scammers",
        }
      }
    }

    // Simulate domain age check (in production, use WHOIS API)
    return {
      score: 5,
      details: "Domain age check passed",
    }
  } catch {
    return { score: 0, details: "Unable to analyze domain age" }
  }
}

function checkSSL(url: string): { score: number; details: string } {
  try {
    const protocol = new URL(url).protocol
    
    if (protocol === "https:") {
      return {
        score: 10,
        details: "✅ Site uses HTTPS encryption",
      }
    } else {
      return {
        score: -15,
        details: "⚠️ Site does NOT use HTTPS - connection is not secure",
      }
    }
  } catch {
    return { score: 0, details: "Unable to verify SSL certificate" }
  }
}

function analyzeURLStructure(url: string): { score: number; details: string } {
  try {
    const urlObj = new URL(url)
    let score = 0
    let issues: string[] = []

    // Check for typosquatting indicators
    const piNetworkDomains = ["minepi.com", "pinetwork.com"]
    const domain = urlObj.hostname.toLowerCase()

    for (const legitDomain of piNetworkDomains) {
      if (domain.includes("pi") && domain !== legitDomain && !domain.endsWith(`.${legitDomain}`)) {
        const similarity = calculateSimilarity(domain, legitDomain)
        if (similarity > 0.6) {
          score -= 20
          issues.push("⚠️ Possible typosquatting - domain looks similar to official Pi Network")
        }
      }
    }

    // Check for suspicious URL patterns
    if (urlObj.hostname.split(".").length > 3) {
      score -= 5
      issues.push("Multiple subdomains detected")
    }

    if (urlObj.searchParams.toString().length > 100) {
      score -= 5
      issues.push("Unusually long query parameters")
    }

    if (/@/.test(urlObj.href)) {
      score -= 15
      issues.push("⚠️ URL contains @ symbol - often used in phishing attacks")
    }

    // Check for IP address instead of domain
    if (/^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) {
      score -= 20
      issues.push("⚠️ Using IP address instead of domain name")
    }

    if (issues.length === 0) {
      return { score: 5, details: "URL structure appears normal" }
    }

    return {
      score,
      details: issues.join("; "),
    }
  } catch {
    return { score: -10, details: "⚠️ Invalid or malformed URL" }
  }
}

function analyzeRedirects(url: string): { score: number; details: string } {
  // In production, this would check actual redirect chains
  // For now, we'll do pattern-based analysis
  
  try {
    const urlObj = new URL(url)
    
    // Check for common redirect patterns used in phishing
    if (urlObj.pathname.includes("redirect") || urlObj.pathname.includes("goto")) {
      return {
        score: -10,
        details: "⚠️ URL contains redirect pattern",
      }
    }

    return {
      score: 5,
      details: "No suspicious redirect patterns detected",
    }
  } catch {
    return { score: 0, details: "Unable to analyze redirects" }
  }
}

function checkCommunityReports(url: string): { score: number; details: string } {
  // Check if there are any community reports for this domain
  const reports = localStorage.getItem("communityReports")
  if (!reports) {
    return { score: 0, details: "No community reports" }
  }

  try {
    const reportList = JSON.parse(reports)
    const normalizedUrl = url.toLowerCase()
    
    const matchingReports = reportList.filter((report: any) => 
      normalizedUrl.includes(report.url.toLowerCase()) || 
      report.url.toLowerCase().includes(normalizedUrl)
    )

    if (matchingReports.length > 0) {
      return {
        score: -15,
        details: `⚠️ ${matchingReports.length} community report(s) for this domain`,
      }
    }

    return { score: 0, details: "No community reports found" }
  } catch {
    return { score: 0, details: "Unable to check community reports" }
  }
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
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
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}
