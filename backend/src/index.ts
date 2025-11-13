import express from "express";
import cors from "cors";
import { env } from "./environments.js";
import path from "path";
import { fileURLToPath } from "url";
import { mountPayments } from "./routes/payments.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors({ origin: env.frontendUrl || true, credentials: false }));

app.get("/", (_req, res) => {
  res.status(200).json({ ok: true, app: "SafePi", env: env.nodeEnv, appId: env.piAppId });
});

app.get("/validation-key.txt", (_req, res) => {
  res.type("text/plain").send(env.validationKey);
});

mountPayments(app);

app.use((_req, res) => res.status(404).json({ ok: false, error: "Not Found" }));

app.listen(env.port, () => {
  console.log(`✅ SafePi backend listening on ${env.port}`);
  console.log(`🔐 CORS allowed origin: ${env.frontendUrl}`);
});