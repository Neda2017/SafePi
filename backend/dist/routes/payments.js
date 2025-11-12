"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/complete", async (req, res) => {
    try {
        const { user, amount, txid } = req.body;
        const parsedAmount = Number(amount);
        if (!user || isNaN(parsedAmount) || parsedAmount <= 0) {
            res.status(400).json({ success: false, message: "Invalid payment data" });
            return;
        }
        console.log("💰 Payment received:", { user, amount: parsedAmount, txid });
        res.json({
            success: true,
            message: "Payment confirmed successfully",
            txid: txid || "demo-txid",
        });
    }
    catch (error) {
        console.error("Payment error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.default = router;
