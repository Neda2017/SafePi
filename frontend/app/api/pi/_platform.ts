import { NextResponse } from "next/server";

const PI_API_BASE = "https://api.minepi.com/v2";

export function jsonError(message: string, status = 500, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export async function piPlatformFetch(path: string, init: RequestInit = {}) {
  const apiKey = process.env.PI_API_KEY;

  if (!apiKey) {
    throw Object.assign(new Error("PI_API_KEY is not configured in Vercel"), { status: 500 });
  }

  const response = await fetch(`${PI_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${apiKey}`,
      ...init.headers,
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw Object.assign(new Error(data.message || data.error || "Pi Platform API request failed"), {
      status: response.status,
      details: data,
    });
  }

  return data;
}

export async function verifyAccessToken(accessToken: string) {
  const response = await fetch(`${PI_API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw Object.assign(new Error(data.message || data.error || "Invalid Pi access token"), {
      status: response.status,
      details: data,
    });
  }

  return data;
}

export function handlePiError(error: unknown) {
  const err = error as Error & { status?: number; details?: unknown };
  return jsonError(err.message || "Unexpected Pi Platform error", err.status || 500, err.details);
}
