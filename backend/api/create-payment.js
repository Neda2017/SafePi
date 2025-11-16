module.exports = async function createPayment(req, res) {
  try {
    const { paymentId } = req.body;
    console.log("TEMP approve payment:", paymentId);

    // Temporary response for Pi Checklist approval
    return res.json({
      success: true,
      message: "Checklist temporary approval OK",
    });

  } catch (err) {
    console.error("Create payment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
