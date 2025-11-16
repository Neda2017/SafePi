const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// API routes
const createPayment = require("./api/create-payment");
const completePayment = require("./api/complete-payment");

app.post("/api/create-payment", createPayment);
app.post("/api/complete-payment", completePayment);

app.get("/", (req, res) => {
  res.send("SafePi backend is running");
});

app.listen(PORT, () => {
  console.log(`SafePi backend running on port ${PORT}`);
});
