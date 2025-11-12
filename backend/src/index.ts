import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import paymentsRouter from "./routes/payments.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// === Root health check ===
app.get("/", (_req: Request, res: Response): void => {
  res.json({
    ok: true,
    message: "✅ SafePi backend is live and running",
    appId: process.env.PI_APP_ID || "safeedfafd9724",
  });
});

// === Validation key for Pi Network verification ===
app.get("/validation-key.txt", (_req: Request, res: Response): void => {
  res
    .type("text/plain")
    .send(
      "8a88ce9cb21e9d6fa7f91efd40400b9db6a4534cc5f0c773c930d02e3338d635e27aaea00ce96d2f6565f96c70bb14dfa557b8a9d59836ebf9ed43ba62d96029"
    );
});

// === Mount payments routes ===
app.use("/api/payments", paymentsRouter);

// === Serve static frontend if needed ===
const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));

const PORT = process.env.PORT || 10000;
app.listen(PORT, (): void => {
  console.log(`✅ SafePi backend running on port ${PORT}`);
});
