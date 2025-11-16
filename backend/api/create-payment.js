// backend/api/create-payment.js
const axios = require("axios");

module.exports = async function createPayment(req, res) {
  const { paymentId } = req.body;
  console.log("Approve payment request:", paymentId);

  if (!paymentId) {
    return res.status(400).json({ error: "paymentId required" });
  }

  try {
    const APIKEY = process.env.PI_API_KEY;
    if (!APIKEY) {
      console.error("PI_API_KEY missing in environment");
      return res.status(500).json({ error: "Pi API key not configured" });
    }

    const headers = {
      headers: {
        authorization: `key ${APIKEY}`, // exactly as in Pi docs
      },
    };

    const url = `https://api.minepi.com/v2/payments/${paymentId}/approve`;

    const piRes = await axios.post(url, null, headers);
    console.log("Pi approve response:", piRes.data);

    // What your frontend / SDK callback expects
    return res.json({ status: "approved" });
  } catch (err) {
    console.error(
      "Error approving payment:",
      err.response?.data || err.message || err
    );
    return res.status(500).json({ error: "Failed to approve payment" });
  }
};
