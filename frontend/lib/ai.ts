import { OpenAI } from "ai";

export const aiModel = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
}).chat.completions;
