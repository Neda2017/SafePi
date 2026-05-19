import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { event, data, webhookUrl } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL required" }, { status: 400 })
    }

    // Send webhook notification
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString(),
        source: "safepi",
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
