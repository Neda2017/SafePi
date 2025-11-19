import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { aiModel } from "@/lib/ai";

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

Analyze this URL and answer ONLY in strict JSON:

{
  "suspicious": boolean,
  "threatLevel": "low" | "medium" | "high",
  "reason": string,
  "category": "phishing" | "fake-airdrop" | "wallet-drain" | "impersonation" | "malware" | "other",
  "confidence": number
}

URL: ${url}
      `,
      temperature: 0.2,
    });

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url,
      ...parsed,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
