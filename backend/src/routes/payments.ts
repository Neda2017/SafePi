import type { Request, Response } from "express";

export function mountPayments(app: any) {
  app.post("/payments/complete", async (req: Request, res: Response) => {
    try {
      const body = req.body || {};
      return res.status(200).json({ ok: true, message: "Payment recorded", received: body });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err?.message || "error" });
    }
  });
}