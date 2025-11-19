import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

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

    const systemPrompt = `
You are a security assistant specialized in detecting phishing and scam links.

Analyze the given URL and respond ONLY with valid JSON (no markdown, no backticks, no explanation) using this exact structure:

{
  "suspicious": boolean,
  "threatLevel": "low" | "medium" | "high",
  "reason": string,
  "category": "phishing" | "fake-airdrop" | "wallet-drain" | "impersonation" | "malware" | "other",
  "confidence": number
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `URL to analyze: ${url}` },
      ],
      temperature: 0.2,
    });

    const raw =
      completion.choices[0].message.content?.toString() ?? "";

    const cleaned = raw
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
