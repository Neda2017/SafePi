const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createPayment(amount: number) {
  const res = await fetch(`${backend}/api/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  if (!res.ok) throw new Error("Failed to create payment");
  return await res.json();
}

export async function completePayment(paymentId: string, txid: string) {
  const res = await fetch(`${backend}/api/payments/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentId, txid }),
  });

  if (!res.ok) throw new Error("Failed to complete payment");
  return await res.json();
}
