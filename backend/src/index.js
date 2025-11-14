"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var payments_js_1 = require("./routes/payments.js");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", function (_req, res) {
    res.json({ ok: true, message: "SafePi backend running" });
});
app.use("/api/payments", payments_js_1.default);
var PORT = process.env.PORT || 10000;
app.listen(PORT, function () {
    console.log("SafePi backend listening on", PORT);
});
