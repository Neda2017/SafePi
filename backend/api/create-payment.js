module.exports = async function createPayment(req, res) {
  const { paymentId } = req.body;
  console.log("TEMP approve payment:", paymentId);

  // Pi Wallet EXPECTS this format:
  return res.json({
    status: "approved",
  });
};
