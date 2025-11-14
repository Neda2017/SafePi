import express = require("express");
const router = express.Router();

router.post("/create", (req, res) => {
  res.json({
    success: true,
    paymentId: "demo-123"
  });
});

router.post("/complete", (req, res) => {
  res.json({
    success: true,
    txid: "demo-999"
  });
});

export = router;
