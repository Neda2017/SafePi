import { NextRequest, NextResponse } from "next/server"
import { calculateTrustScore } from "@/lib/trust-score"
import { scamDatabase } from "@/lib/scam-database"

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }) // 1 minute window
    return true
  }

  if (limit.count >= 30) {
    // 30 requests per minute
    return false
  }

  limit.count++
  return true
}

export async function GET(request: NextRequest) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  }

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: "Maximum 30 requests per minute. Please try again later.",
      },
      { status: 429, headers: { ...headers, "Retry-After": "60" } },
    )
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json(
        {
          error: "URL parameter is required",
          usage: "GET /api/check-url?url=https://example.com",
        },
        { status: 400, headers },
      )
    }

    const result = calculateTrustScore(url)

    const scamDetails = scamDatabase.find((scam) => {
      const normalizedUrl = url
        .toLowerCase()
        .trim()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "")
        .replace(/^www\./, "")

      const scamNormalized = scam.url
        .toLowerCase()
        .trim()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "")
        .replace(/^www\./, "")

      return (
        scamNormalized === normalizedUrl ||
        normalizedUrl.includes(scamNormalized) ||
        scamNormalized.includes(normalizedUrl)
      )
    })

    const response = {
      url,
      safe: result.level === "excellent" || result.level === "good",
      trustScore: result.score,
      level: result.level,
      threatLabel: result.threatLabel,
      detectedPatterns: result.detectedPatterns,
      factors: result.factors,
      recommendation:
        result.threatLabel === "DANGEROUS"
          ? "⚠️ DANGEROUS - DO NOT VISIT - This site is extremely dangerous"
          : result.threatLabel === "PHISHING"
            ? "⚠️ PHISHING SITE - DO NOT ENTER ANY CREDENTIALS"
            : result.threatLabel === "FAKE SITE"
              ? "⚠️ FAKE SITE - This site is impersonating a legitimate service"
              : result.threatLabel === "SCAM"
                ? "⚠️ SCAM DETECTED - Do not send money or provide personal information"
                : result.threatLabel === "SUSPICIOUS"
                  ? "⚠️ SUSPICIOUS - Proceed with extreme caution"
                  : "✓ SAFE - No threats detected",
      scamDetails: scamDetails
        ? {
            type: scamDetails.type,
            severity: scamDetails.severity,
            description: scamDetails.description,
            reports: scamDetails.reports,
            reportedAt: scamDetails.lastReported,
          }
        : null,
      checkedAt: new Date().toISOString(),
    }

    return NextResponse.json(response, { headers })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to check URL",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers },
    )
  }
}

export async function POST(request: NextRequest) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  }

  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        {
          error: "URL is required in request body",
          usage: 'POST /api/check-url with body: {"url": "https://example.com"}',
        },
        { status: 400, headers },
      )
    }

    // Reuse GET logic
    const searchParams = new URLSearchParams({ url })
    const getRequest = new NextRequest(new URL(`${request.nextUrl.origin}/api/check-url?${searchParams.toString()}`))
    return GET(getRequest)
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to parse request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400, headers },
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
}
