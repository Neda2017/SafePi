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

    // Ask the model to return JSON only
    const { text } = await generateText({
      model: aiModel,
      prompt: `
Return ONLY valid JSON.
No markdown. No backticks. No explanation.

Analyze this URL: ${url}

Return a JSON object with exactly these fields:

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

    // Clean accidental markdown code fences just in case
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
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
