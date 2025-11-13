"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Mock verification route
router.post("/complete", async (req, res) => {
    return res.json({
        success: true,
        message: "Payment confirmed successfully",
        txid: "demo-123"
    });
});
exports.default = router;
