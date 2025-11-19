// app/api/ai/analyze-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { aiModel } from "@/lib/ai"; // adjust path if needed

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = (body?.url || "").trim();

    if (!url) {
      return NextResponse.json(
        { error: "Missing 'url' in request body." },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: aiModel,
      prompt: `
You are a security assistant specialized in detecting phishing and scam links.

Analyze this URL and answer ONLY in strict JSON (no extra text) with the following shape:

{
  "suspicious": boolean,
  "threatLevel": "low" | "medium" | "high",
  "reason": string,
  "category": "phishing" | "fake-airdrop" | "wallet-drain" | "impersonation" | "malware" | "other",
  "confidence": number
}

URL to analyze: ${url}
      `.trim(),
      temperature: 0.2,
    });

    // Try parsing the JSON the model returned
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse AI JSON:", text);
      return NextResponse.json(
        { error: "AI response format error", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url,
      ...parsed,
    });
  } catch (error) {
    console.error("AI analyze-link error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
