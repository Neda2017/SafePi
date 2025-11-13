"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const payments_js_1 = __importDefault(require("./routes/payments.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "*",
}));
// Health check
app.get("/", (req, res) => {
    res.json({
        ok: true,
        message: "SafePi backend is running",
        appId: process.env.PI_APP_ID || "missing"
    });
});
// Payments API
app.use("/api/payments", payments_js_1.default);
const PORT = Number(process.env.PORT) || 10000;
app.listen(PORT, () => {
    console.log(`🚀 SafePi backend running on port ${PORT}`);
});
