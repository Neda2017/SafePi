// server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

// ===== CONFIG =====
const FRONTEND_ORIGIN = "https://safepi.onrender.com";
const PI_API_KEY = process.env.PI_API_KEY;       // from Pi dev portal
const PI_API_SECRET = process.env.PI_API_SECRET; // from Pi dev portal

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());

// ===== HELPER: call Pi Platform API =====

async function piApprovePayment(paymentId) {
  if (!PI_API_KEY || !PI_API_SECRET) {
    throw new Error("Missing PI_API_KEY or PI_API_SECRET in environment.");
  }

  const url = `https://api.minepi.com/v2/payments/${paymentId}/approve`;

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Key ${PI_API_KEY}:${PI_API_SECRET}`,
  };

  const res = await axios.post(url, {}, { headers });
  return res.data;
}

async function piCompletePayment(paymentId, txid) {
  if (!PI_API_KEY || !PI_API_SECRET) {
    throw new Error("Missing PI_API_KEY or PI_API_SECRET in environment.");
  }

  const url = `https://api.minepi.com/v2/payments/${paymentId}/complete`;

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Key ${PI_API_KEY}:${PI_API_SECRET}`,
  };

  const body = { txid };

  const res = await axios.post(url, body, { headers });
  return res.data;
}

// ===== ROUTES =====

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "SafePi backend is running." });
});

// Called when Pi SDK says "onReadyForServerApproval"
app.post("/api/create-payment", async (req, res) => {
  try {
    const { paymentId } = req.body;
    console.log(">> /api/create-payment called with:", paymentId);

    if (!paymentId) {
      return res.status(400).json({ success: false, error: "paymentId required" });
    }

    const result = await piApprovePayment(paymentId);
    console.log("Pi approve response:", result);

    res.json({ success: true, result });
  } catch (err) {
    console.error("Error in /api/create-payment:", err?.response?.data || err.message || err);
    res.status(500).json({
      success: false,
      error: err?.response?.data || String(err),
    });
  }
});

// Called when Pi SDK says "onReadyForServerCompletion"
app.post("/api/complete-payment", async (req, res) => {
  try {
    const { paymentId, txid } = req.body;
    console.log(">> /api/complete-payment called with:", paymentId, txid);

    if (!paymentId || !txid) {
      return res.status(400).json({ success: false, error: "paymentId and txid required" });
    }

    const result = await piCompletePayment(paymentId, txid);
    console.log("Pi complete response:", result);

    res.json({ success: true, result });
  } catch (err) {
    console.error("Error in /api/complete-payment:", err?.response?.data || err.message || err);
    res.status(500).json({
      success: false,
      error: err?.response?.data || String(err),
    });
  }
});

// ===== START SERVER =====

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SafePi backend running on port ${PORT}`);
});
