"use client";

import { createPayment } from "../lib/api";

export default function Page() {

  async function handlePayment() {
    try {
      const data = await createPayment({});
      console.log("Payment created:", data);
    } catch (err) {
      console.error("Payment error:", err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>SafePi Payment Test</h1>
      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          background: "purple",
          color: "white",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Create Payment
      </button>
    </div>
  );
}
