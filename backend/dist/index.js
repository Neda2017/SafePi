"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const environments_js_1 = require("./environments.js");
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const payments_js_1 = require("./routes/payments.js");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: environments_js_1.env.frontendUrl || true, credentials: false }));
app.get("/", (_req, res) => {
    res.status(200).json({ ok: true, app: "SafePi", env: environments_js_1.env.nodeEnv, appId: environments_js_1.env.piAppId });
});
app.get("/validation-key.txt", (_req, res) => {
    res.type("text/plain").send(environments_js_1.env.validationKey);
});
(0, payments_js_1.mountPayments)(app);
app.use((_req, res) => res.status(404).json({ ok: false, error: "Not Found" }));
app.listen(environments_js_1.env.port, () => {
    console.log(`✅ SafePi backend listening on ${environments_js_1.env.port}`);
    console.log(`🔐 CORS allowed origin: ${environments_js_1.env.frontendUrl}`);
});
