import express, { Request, Response } from "express";

const router = express.Router();

// Mock verification route
router.post("/complete", async (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Payment confirmed successfully",
    txid: "demo-123"
  });
});

export default router;
