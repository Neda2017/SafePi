"use strict";
const express = require("express");
const router = express.Router();
router.post("/create", (req, res) => {
    console.log("Payment create request:", req.body);
    res.json({ success: true, paymentId: "demo-123" });
});
router.post("/complete", (req, res) => {
    console.log("Payment completed:", req.body);
    res.json({ success: true, txid: "demo-tx-999" });
});
module.exports = router;
