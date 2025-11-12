import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// === Base health endpoint ===
app.get("/", (_req, res) => {
    res.json({
        ok: true,
        message: "✅ SafePi backend is live and running",
        appId: process.env.PI_APP_ID || "safeedfafd9724",
    });
});
// === Pi validation key endpoint ===
app.get("/validation-key.txt", (_req, res) => {
    res
        .type("text/plain")
        .send("8a88ce9cb21e9d6fa7f91efd40400b9db6a4534cc5f0c773c930d02e3338d635e27aaea00ce96d2f6565f96c70bb14dfa557b8a9d59836ebf9ed43ba62d96029");
});
// === Payments API routes ===
import paymentsRouter from "./routes/payments.js";
app.use("/api/payments", paymentsRouter);
// === Serve frontend build (if merged fullstack) ===
const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`✅ SafePi backend running on port ${port}`);
});
