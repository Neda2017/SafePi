"use server";

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

    // Force STRICT JSON (no markdown, no text)
    const { text } = await generateText({
      model: aiModel,
      prompt: `Analyze the following URL and return ONLY valid JSON. No backticks. No markdown. No explanation.

URL: ${url}

Return a JSON object with:
{
  "suspicious": boolean,
  "threatLevel": "low" | "medium" | "high",
  "reason": string,
  "category": "phishing" | "fake-airdrop" | "wallet-drain" | "impersonation" | "malware" | "other",
  "confidence": number
}
`,
      temperature: 0.2,
      response_format: {
        type: "json_object",
      },
    });

    // Parse strict JSON
    const parsed = JSON.parse(text);

    return NextResponse.json({
      url,
      ...parsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
