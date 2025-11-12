import { Router, Request, Response } from "express";

const router = Router();

interface PaymentRequestBody {
  user?: string;
  amount?: number | string;
  txid?: string;
}

// === POST /api/payments/complete ===
router.post("/complete", async (req: Request<{}, {}, PaymentRequestBody>, res: Response): Promise<void> => {
  try {
    const { user, amount, txid } = req.body;

    const parsedAmount = typeof amount === "number" ? amount : Number(amount);

    if (!user || isNaN(parsedAmount) || parsedAmount <= 0) {
      res.status(400).json({ success: false, message: "Invalid payment data" });
      return;
    }

    console.log("💰 Payment received:", { user, amount: parsedAmount, txid });

    res.json({
      success: true,
      message: "Payment confirmed successfully",
      txid: txid || "demo-txid",
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;

