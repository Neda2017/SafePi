// server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// IMPORTANT — your approved FRONTEND domain:
const FRONTEND_ORIGIN = "https://safepi.onrender.com";

// Apply CORS
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Pi SDK backend functions
const axios = require("axios");

// Approve payment
async function approvePayment(paymentId) {
  const url = `https://api.minepi.com/v2/payments/${paymentId}/approve`;
  const apiKey = process.env.PI_API_KEY;
  const secretKey = process.env.PI_SECRET;

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Key ${apiKey}:${secretKey}`,
  };

  const response = await axios.post(url, {}, { headers });
  return response.data;
}

// Complete payment
async function completePayment(paymentId, txid) {
  const url = `https://api.minepi.com/v2/payments/${paymentId}/complete`;
  const apiKey = process.env.PI_API_KEY;
  const secretKey = process.env.PI_SECRET;

  const data = { txid };

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Key ${apiKey}:${secretKey}`,
  };

  const response = await axios.post(url, data, { headers });
  return response.data;
}

// -------------------------------
//  ROUTES FOR SAFEPI FRONTEND
// -------------------------------

// Create payment (server approval)
app.post("/api/create-payment", async (req, res) => {
  try {
    const { paymentId } = req.body;
    console.log("Approving payment:", paymentId);

    const result = await approvePayment(paymentId);

    res.json({ success: true, result });
  } catch (err) {
    console.error("Payment approval error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// Complete payment
app.post("/api/complete-payment", async (req, res) => {
  try {
    const { paymentId, txid } = req.body;
    console.log("Completing payment:", paymentId, txid);

    const result = await completePayment(paymentId, txid);

    res.json({ success: true, result });
  } catch (err) {
    console.error("Payment complete error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// Root page
app.get("/", (req, res) => {
  res.send("SafePi backend is running.");
});

// -------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port:", PORT);
});
