"use client";

import React from "react";
import { createPayment complete Payment } from "@/lib/api";

export default function HomePage() {
  async function handlePayment() {
    try {
      // 1️⃣ Tell backend to create a payment request
      const payment = await createPayment(1); // 1 Pi (or any amount)
      console.log("Payment created:", payment);

      // 2️⃣ Placeholder until Pi Browser SDK is added
      const txid = "demo-txid-123"; 
      console.log("Simulated txid:", txid);

      // 3️⃣ Confirm payment on backend
      const completed = await completePayment(payment.paymentId, txid);
      console.log("Payment completed:", completed);

      alert("Payment simulation completed successfully!");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed — check console.");
    }
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>SafePi Payment Demo</h1>
      <p style={styles.subtitle}>
        Click the button below to simulate a Pi payment.
      </p>

      <button style={styles.button} onClick={handlePayment}>
        Pay with Pi
      </button>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#666",
  },
  button: {
    backgroundColor: "#ffcc00",
    border: "none",
    padding: "12px 26px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
