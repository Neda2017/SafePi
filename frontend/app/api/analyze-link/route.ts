import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { aiModel } from "@/lib/ai";
import { z } from "zod";

const schema = z.object({
  suspicious: z.boolean(),
  threatLevel: z.enum(["low", "medium", "high"]),
  reason: z.string(),
  category: z.enum([
    "phishing",
    "fake-airdrop",
    "wallet-drain",
    "impersonation",
    "malware",
    "other",
  ]),
  confidence: z.number(),
});

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

    // AI call happens inside POST, not top-level → OK
    const { object } = await generateObject({
      model: aiModel,
      schema,
      prompt: `Analyze this URL for scam or phishing indicators: ${url}`,
      temperature: 0.2,
    });

    return NextResponse.json({ url, ...object });

  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
