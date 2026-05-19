import { type NextRequest, NextResponse } from "next/server"
import { calculateTrustScore } from "@/lib/trust-score"
import { scamDatabase } from "@/lib/scam-database"
import { safeSites } from "@/lib/safe-sites"

// Telegram Bot API endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle Telegram webhook updates
    if (body.message) {
      const chatId = body.message.chat.id
      const text = body.message.text || ""

      // Handle /start command
      if (text.startsWith("/start")) {
        await sendTelegramMessage(
          chatId,
          "🛡️ Welcome to Safeπ Bot!\n\n" +
            "I help you check if Pi Network links are safe or scams.\n\n" +
            "Commands:\n" +
            "/check <url> - Check if a URL is safe\n" +
            "/stats - View scam database statistics\n" +
            "/help - Show this help message\n\n" +
            "Just send me any URL and I'll scan it for you!",
        )
        return NextResponse.json({ ok: true })
      }

      // Handle /stats command
      if (text.startsWith("/stats")) {
        const stats =
          `📊 Safeπ Database Statistics\n\n` +
          `🚨 Known Threats: ${scamDatabase.length}\n` +
          `✅ Verified Sites: ${safeSites.length}\n` +
          `🔥 Critical Threats: ${scamDatabase.filter((s) => s.severity === "critical").length}\n` +
          `⚠️ High Severity: ${scamDatabase.filter((s) => s.severity === "high").length}\n\n` +
          `Stay safe! Always verify links before clicking.`

        await sendTelegramMessage(chatId, stats)
        return NextResponse.json({ ok: true })
      }

      // Handle /check command or direct URL
      const urlMatch = text.match(/(?:\/check\s+)?(?:https?:\/\/)?([^\s]+)/i)
      if (urlMatch) {
        let url = urlMatch[0].replace("/check ", "").trim()

        // Add https:// if not present
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "https://" + url
        }

        // Validate URL
        try {
          new URL(url)
        } catch {
          await sendTelegramMessage(chatId, "❌ Invalid URL format. Please send a valid URL.")
          return NextResponse.json({ ok: true })
        }

        // Calculate trust score
        const result = calculateTrustScore(url)

        // Check if it's a known scam
        const normalizedUrl = url
          .toLowerCase()
          .replace(/^https?:\/\//, "")
          .replace(/\/$/, "")
        const scamEntry = scamDatabase.find(
          (scam) =>
            scam.url.toLowerCase().includes(normalizedUrl) ||
            normalizedUrl.includes(
              scam.url
                .toLowerCase()
                .replace(/^https?:\/\//, "")
                .replace(/\/$/, ""),
            ),
        )

        // Check if it's official
        const safeSite = safeSites.find(
          (site) => normalizedUrl.includes(site.url.toLowerCase()) || site.url.toLowerCase().includes(normalizedUrl),
        )

        let message = `🔍 Scan Results for:\n${url}\n\n`

        if (safeSite) {
          message += `✅ OFFICIAL SITE\n\n`
          message += `Trust Score: ${result.score}/100 🟢\n`
          message += `Site: ${safeSite.name}\n`
          message += `Type: ${safeSite.type}\n\n`
          message += `✓ This is a verified official Pi Network site.`
        } else if (scamEntry) {
          message += `🚨 DANGER - KNOWN SCAM\n\n`
          message += `Trust Score: ${result.score}/100 🔴\n`
          message += `Threat Type: ${scamEntry.type}\n`
          message += `Severity: ${scamEntry.severity.toUpperCase()}\n`
          message += `Reports: ${scamEntry.reports}\n\n`
          message += `⚠️ ${scamEntry.description}\n\n`
          message += `❌ DO NOT visit this site or enter any credentials!`
        } else {
          const emoji = result.score >= 80 ? "🟢" : result.score >= 60 ? "🔵" : result.score >= 40 ? "🟡" : "🔴"
          message += `Trust Score: ${result.score}/100 ${emoji}\n`
          message += `Level: ${result.level.toUpperCase()}\n\n`

          if (result.detectedPatterns && result.detectedPatterns.length > 0) {
            message += `⚠️ Suspicious Patterns:\n`
            result.detectedPatterns.forEach((pattern) => {
              message += `• ${pattern}\n`
            })
            message += `\n`
          }

          if (result.score < 60) {
            message += `⚠️ Proceed with caution. This site shows suspicious characteristics.`
          } else {
            message += `✓ No immediate threats detected, but always verify before entering credentials.`
          }
        }

        message += `\n\n🔗 Check more at: https://safepi.vercel.app`

        await sendTelegramMessage(chatId, message)
        return NextResponse.json({ ok: true })
      }

      // Default response
      await sendTelegramMessage(
        chatId,
        "Send me a URL to check, or use:\n" +
          "/check <url> - Check a URL\n" +
          "/stats - View statistics\n" +
          "/help - Show help",
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] Telegram webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    console.error("[v0] TELEGRAM_BOT_TOKEN not configured")
    return
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      console.error("[v0] Failed to send Telegram message:", await response.text())
    }
  } catch (error) {
    console.error("[v0] Error sending Telegram message:", error)
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Safeπ Telegram Bot API",
    message: "Use POST to send webhook updates",
  })
}
