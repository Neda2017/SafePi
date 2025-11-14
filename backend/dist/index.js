"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "*"
}));
// Health/root route
app.get("/", (_req, res) => {
    res.json({
        ok: true,
        message: "SafePi backend running",
        appId: process.env.PI_APP_ID || "missing-PI_APP_ID"
    });
});
// Payments routes
const paymentsRouter = require("./routes/payments");
app.use("/api/payments", paymentsRouter);
// Port (Render will inject PORT)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ SafePi backend listening on ${PORT}`);
    console.log(`🔐 CORS origin: ${process.env.FRONTEND_URL || "ANY"}`);
});
