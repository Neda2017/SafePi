export const env = {
    nodeEnv: process.env.NODE_ENV || "production",
    port: parseInt(process.env.PORT || "10000", 10),
    frontendUrl: process.env.FRONTEND_URL || "https://safepi.onrender.com",
    piAppId: process.env.PI_APP_ID || "safeedfafd9724",
    validationKey: process.env.PI_VALIDATION_KEY ||
        "8a88ce9cb21e9d6fa7f91efd40400b9db6a4534cc5f0c773c930d02e3338d635e27aaea00ce96d2f6565f96c70bb14dfa557b8a9d59836ebf9ed43ba62d96029",
};
