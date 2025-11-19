// lib/ai.ts
import { openai } from "@ai-sdk/openai";

export const aiModel = openai("gpt-4.1-mini");
// or: openai("gpt-4o-mini") if you prefer
