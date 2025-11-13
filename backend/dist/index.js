"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const environments_1 = require("./environments");
const payments_1 = __importDefault(require("./routes/payments"));
const app = (0, express_1.default)();
// Allow JSON body
app.use(express_1.default.json());
// Allow frontend
app.use((0, cors_1.default)({
    origin: environments_1.ENV.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
}));
// Health check
app.get("/", (_req, res) => {
    res.json({ ok: true, message: "SafePi backend live", appId: environments_1.ENV.APP_ID });
});
// Static validation file
app.get("/validation-key.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(environments_1.ENV.VALIDATION_KEY);
});
// Payments routes
app.use("/api/payments", payments_1.default);
// Start server
app.listen(Number(environments_1.ENV.PORT), () => {
    console.log(`\n✅ SafePi backend listening on ${environments_1.ENV.PORT}`);
    console.log(`🔐 CORS allowed origin: ${environments_1.ENV.FRONTEND_URL}`);
});
