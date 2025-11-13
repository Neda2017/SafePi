"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /api/payments
router.post("/", async (req, res) => {
    try {
        res.json({
            success: true,
            message: "Payment initialized"
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// POST /api/payments/complete
router.post("/complete", async (req, res) => {
    try {
        const txid = req.body?.txid || "demo-123";
        res.json({
            success: true,
            message: "Payment confirmed successfully",
            txid
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
