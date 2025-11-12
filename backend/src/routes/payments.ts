import { Router, Request, Response } from "express";

const router = Router();

/**
 * Demo endpoint to simulate Pi payment completion.
 * In production, you’ll verify the Pi Network payment server-side here.
 */
router.post("/complete", async (req: Request, res: Response) => {
  try {
    const { user, amount, txid } = req.body;
    const parsedAmount = Number(amount);

    if (!user || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid payment data" });
    }

    // Simulate confirmation
    console.log("💰 Payment received:", { user, amount: parsedAmount, txid });

    return res.json({
      success: true,
      message: "Payment confirmed successfully",
      txid: txid || "demo-txid",
    });
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
