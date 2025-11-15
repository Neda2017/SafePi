const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Root test
app.get("/", (req, res) => {
  res.json({ message: "SafePi Backend is running" });
});

// Create payment endpoint
app.post("/api/create-payment", (req, res) => {
  console.log("Create Payment Body:", req.body);

  // Dummy payment data for now
  const paymentId = Date.now().toString();
  const amount = req.body.amount || 1;

  res.json({
    success: true,
    paymentId,
    amount
  });
});

// Complete payment endpoint
app.post("/api/complete-payment", (req, res) => {
  console.log("Complete Payment Body:", req.body);

  res.json({
    success: true,
    status: "payment_completed"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
