// lib/api.ts

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://safepi-botj.onrender.com";

export async function createPayment(body: any) {
  const res = await fetch(`${BACKEND_URL}/api/create-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status}`);
  }

  return res.json();
}

export async function completePayment(body: any) {
  const res = await fetch(`${BACKEND_URL}/api/complete-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status}`);
  }

  return res.json();
}
