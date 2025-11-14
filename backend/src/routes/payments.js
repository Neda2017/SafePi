"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.default.Router();
router.post("/create", function (req, res) {
    res.json({ success: true, paymentId: "demo-123" });
});
router.post("/complete", function (req, res) {
    res.json({ success: true, txid: "demo-txid" });
});
exports.default = router;
