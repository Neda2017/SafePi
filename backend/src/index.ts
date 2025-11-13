import express, { type Request, type Response } from "express";
import cors from "cors";
import path from "path";
import { ENV } from "./environments";
import paymentsRouter from "./routes/payments";

const app = express();

// Allow JSON body
app.use(express.json());

// Allow frontend
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  })
);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({ ok: true, message: "SafePi backend live", appId: ENV.APP_ID });
});

// Static validation file
app.get("/validation-key.txt", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(ENV.VALIDATION_KEY);
});

// Payments routes
app.use("/api/payments", paymentsRouter);

// Start server
app.listen(Number(ENV.PORT), () => {
  console.log(`\n✅ SafePi backend listening on ${ENV.PORT}`);
  console.log(`🔐 CORS allowed origin: ${ENV.FRONTEND_URL}`);
});
