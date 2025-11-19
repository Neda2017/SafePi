import { createOpenAI } from "ai";

export const aiModel = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
}).languageModel("gpt-4.1-mini");
