"use strict";
const express = require("express");
const router = express.Router();
// Create payment
router.post("/create", (req, res) => {
    // You can read req.body here if needed
    res.json({
        success: true,
        paymentId: "demo-123"
    });
});
// Complete payment (Pi callback)
router.post("/complete", (req, res) => {
    // You can verify the payment here later
    res.json({
        success: true,
        message: "Payment confirmed successfully",
        txid: "demo-999"
    });
});
module.exports = router;
