// backend/api/complete-payment.js
const axios = require("axios");

module.exports = async function completePayment(req, res) {
  const { paymentId, txid } = req.body;
  console.log("Complete payment request:", paymentId, txid);

  if (!paymentId || !txid) {
    return res
      .status(400)
      .json({ error: "paymentId and txid are required" });
  }

  try {
    const APIKEY = process.env.PI_API_KEY;
    if (!APIKEY) {
      console.error("PI_API_KEY missing in environment");
      return res.status(500).json({ error: "Pi API key not configured" });
    }

    const headers = {
      headers: {
        authorization: `key ${APIKEY}`,
      },
    };

    const url = `https://api.minepi.com/v2/payments/${paymentId}/complete`;
    const body = { txid };

    const piRes = await axios.post(url, body, headers);
    console.log("Pi complete response:", piRes.data);

    // What your frontend / SDK callback expects
    return res.json({ status: "completed" });
  } catch (err) {
    console.error(
      "Error completing payment:",
      err.response?.data || err.message || err
    );
    return res.status(500).json({ error: "Failed to complete payment" });
  }
};
