module.exports = async function completePayment(req, res) {
  const { paymentId, txid } = req.body;
  console.log("TEMP complete payment:", paymentId, txid);

  // Pi Wallet EXPECTS this format:
  return res.json({
    status: "completed",
  });
};
