"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const payments_1 = __importDefault(require("./routes/payments"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// === Health check ===
app.get("/", (_req, res) => {
    res.json({
        ok: true,
        message: "✅ SafePi backend is live and running",
        appId: process.env.PI_APP_ID || "safeedfafd9724",
    });
});
// === Validation key for Pi Network verification ===
app.get("/validation-key.txt", (_req, res) => {
    res
        .type("text/plain")
        .send("8a88ce9cb21e9d6fa7f91efd40400b9db6a4534cc5f0c773c930d02e3338d635e27aaea00ce96d2f6565f96c70bb14dfa557b8a9d59836ebf9ed43ba62d96029");
});
// === Payment routes ===
app.use("/api/payments", payments_1.default);
// === Serve static frontend if needed ===
const publicPath = path_1.default.join(process.cwd(), "public");
app.use(express_1.default.static(publicPath));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ SafePi backend running on port ${PORT}`);
});
