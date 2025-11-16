module.exports = async function completePayment(req, res) {
  try {
    const { paymentId, txid } = req.body;
    console.log("TEMP complete payment:", paymentId, txid);

    // Temporary response for Pi Checklist completion
    return res.json({
      success: true,
      message: "Checklist temporary completion OK",
    });

  } catch (err) {
    console.error("Complete payment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
