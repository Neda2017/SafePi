import { NextResponse } from "next/server";
import { handlePiError, jsonError, piPlatformFetch } from "../_platform";

export async function POST(request: Request) {
  try {
    const { paymentId, txid } = await request.json();

    if (!paymentId || !txid) {
      return jsonError("paymentId and txid are required", 400);
    }

    const payment = await piPlatformFetch(`/payments/${encodeURIComponent(paymentId)}/complete`, {
      method: "POST",
      body: JSON.stringify({ txid }),
    });

    return NextResponse.json({ payment });
  } catch (error) {
    return handlePiError(error);
  }
}
