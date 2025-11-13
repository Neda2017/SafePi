"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
require("dotenv/config");
exports.ENV = {
    PORT: process.env.PORT || "10000",
    FRONTEND_URL: process.env.FRONTEND_URL || "https://safepi-botj.onrender.com",
    VALIDATION_KEY: process.env.VALIDATION_KEY || "",
    APP_ID: process.env.APP_ID || "",
    PI_API_KEY: process.env.PI_API_KEY || ""
};
