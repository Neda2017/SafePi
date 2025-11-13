import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentsRouter from "./routes/payments.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({
    ok: true,
    message: "SafePi backend is running",
    appId: process.env.PI_APP_ID || "missing"
  });
});

// Payments API
app.use("/api/payments", paymentsRouter);

const PORT = Number(process.env.PORT) || 10000;
app.listen(PORT, () => {
  console.log(`🚀 SafePi backend running on port ${PORT}`);
});
