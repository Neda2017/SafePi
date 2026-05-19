export const PAYMENT_CONFIG = {
  // Wallet address must be set in Pi Admin Portal for your app
  // Get your wallet from: https://minepi.com/developer/dashboard
  WALLET_ADDRESS: "GD3ZBBGBLVPFSQUWR34KDI5OK6Y5JUGMPG2ZPOXQO2FYBLIM3VUQVKVG",

  // Daily pass pricing
  DAILY_PASS_PRICE: 0.1, // 0.1 Pi for 24 hours unlimited access

  // Free tier limits
  FREE_SCANS_PER_DAY: 5,

  // Payment memos
  PAYMENT_MEMO: "Safeπ Daily Pass - 24h Unlimited Scans",

  // Development mode detection for v0 preview environment
  isDevelopmentMode: () => {
    if (typeof window === "undefined") return false
    // Simulate only in local/App Studio preview. Production Vercel must use Pi Wallet.
    return (
      window.location.hostname.includes("v0.app") ||
      window.location.hostname.includes("vusercontent.net") ||
      window.location.hostname === "localhost"
    )
  },

  // Instructions for setting up payments
  SETUP_INSTRUCTIONS: `
To enable Pi Network payments in your Safeπ app:

1. Go to https://minepi.com/developer/dashboard
2. Navigate to your app settings
3. Enable "Payments" in the app capabilities
4. Create a wallet for your app (if not already created)
5. Copy your app's wallet address
6. Update the WALLET_ADDRESS in this config file
7. Deploy your app
8. Test payments in Pi Browser

For testing in development mode (v0.app), payments are simulated automatically.
  `,
}
