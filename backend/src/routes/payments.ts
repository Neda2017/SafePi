import { Router, type Request, type Response } from "express";

const router = Router();

// POST /api/payments
router.post("/", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      message: "Payment initialized"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/payments/complete
router.post("/complete", async (req: Request, res: Response) => {
  try {
    const txid = req.body?.txid || "demo-123";

    res.json({
      success: true,
      message: "Payment confirmed successfully",
      txid
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
