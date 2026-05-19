import { NextResponse } from "next/server";
import { handlePiError, jsonError, verifyAccessToken } from "../_platform";

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return jsonError("accessToken is required", 400);
    }

    const user = await verifyAccessToken(accessToken);
    return NextResponse.json({ user });
  } catch (error) {
    return handlePiError(error);
  }
}
