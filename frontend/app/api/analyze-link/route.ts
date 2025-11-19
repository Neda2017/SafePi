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

    // Ask for JSON only
    const { text } = await generateText({
      model: aiModel,
      prompt: `
Return ONLY valid JSON. 
No code blocks, no markdown, no explanation.

Analyze this URL: ${url}

Format:
{
  "suspicious": boolean,
  "threatLevel": "low" | "medium" | "high",
  "reason": string,
  "category": "phishing" | "fake-airdrop" | "wallet-drain" | "impersonation" | "malware" | "other",
  "confidence": number
}
`,
      temperature: 0.2,
    });

    // Clean accidental markdown code fences
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      url,
      ...parsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
