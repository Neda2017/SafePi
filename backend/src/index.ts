import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import paymentsRouter from "./routes/payments";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Root test route
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "✅ SafePi backend is live and running",
    appId: "safeedfafd9724",
  });
});

// Payments API
app.use("/api/payments", paymentsRouter);

// Serve static files if needed
const __dirnameResolved = path.resolve();
app.use(express.static(path.join(__dirnameResolved, "public")));

app.listen(PORT, () => {
  console.log(`✅ SafePi backend running on port ${PORT}`);
});
