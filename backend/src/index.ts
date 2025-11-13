import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

// ---- ENVIRONMENT ----
const PORT = Number(process.env.PORT) || 10000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://safepi-botj.onrender.com";
const PI_APP_ID = process.env.PI_APP_ID || "safeedfafd9724";
const PI_VALIDATION_KEY = process.env.PI_VALIDATION_KEY || "";

// ---- MIDDLEWARE ----
app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: false,
  })
);

// ---- ROUTES ----

// Root – quick health/info
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    message: "SafePi backend is running 🚀",
    appId: PI_APP_ID,
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Pi domain validation file
app.get("/validation-key.txt", (_req: Request, res: Response) => {
  if (!PI_VALIDATION_KEY) {
    return res
      .status(500)
      .type("text/plain")
      .send("pi-verification-key-missing");
  }

  res
    .status(200)
    .type("text/plain")
    .send(`pi-verification=${PI_VALIDATION_KEY}`);
});

// Payment completion endpoint used by the frontend
app.post("/api/payments/complete", (req: Request, res: Response) => {
  const { txid } = req.body ?? {};

  // For now just echo success – you can plug in real Pi validation later
  res.status(200).json({
    success: true,
    message: "Payment confirmed successfully (demo backend)",
    txid: txid || "demo-123",
  });
});

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`✅ SafePi backend listening on ${PORT}`);
  console.log(`🔐 CORS allowed origin: ${FRONTEND_URL}`);
});
