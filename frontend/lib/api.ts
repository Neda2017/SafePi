export async function createPayment() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API}/api/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}), // no arguments needed
  });

  if (!res.ok) {
    throw new Error("Failed to create payment");
  }

  return res.json(); // { paymentId, amount }
}

export async function completePayment(paymentId: string) {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API}/api/payments/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentId }),
  });

  if (!res.ok) {
    throw new Error("Failed to confirm payment");
  }

  return res.json();
}
