"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;
// Test endpoint
app.get("/", (_req, res) => {
    res.json({ ok: true, message: "SafePi backend running", port: PORT });
});
// Payments routes
const paymentsRouter = require("./routes/payments");
app.use("/api/payments", paymentsRouter);
app.listen(PORT, () => {
    console.log(`🚀 SafePi backend running on port ${PORT}`);
});
