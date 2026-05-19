import { NextResponse } from "next/server";
import { handlePiError, jsonError, piPlatformFetch } from "../_platform";

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return jsonError("paymentId is required", 400);
    }

    const payment = await piPlatformFetch(`/payments/${encodeURIComponent(paymentId)}/cancel`, {
      method: "POST",
    });

    return NextResponse.json({ payment });
  } catch (error) {
    return handlePiError(error);
  }
}
