import express = require("express");
import cors = require("cors");
import dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "SafePi backend running" });
});

// Payments router
const paymentsRouter = require("./routes/payments");
app.use("/api/payments", paymentsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SafePi backend running on port ${PORT}`);
});
