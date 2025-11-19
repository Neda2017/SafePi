"use server";

import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { aiModel } from "@/lib/ai";
import { z } from "zod";

// JSON schema the AI must follow
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

    // Strict JSON output (no markdown, no wrappers)
    const { object } = await generateObject({
      model: aiModel,
      schema,
      prompt: `Analyze this URL for scam or phishing indicators: ${url}`,
      temperature: 0.2,
      response_format: { type: "json_schema" }, // ⭐ THE CRITICAL LINE
    });

    return NextResponse.json({
      url,
      ...object,
    });
  } catch (error: any) {
    return NextResponse.json(
      { err
