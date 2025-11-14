"use client";

import { useState } from "react";
import { createPayment, completePayment } from "@/lib/api";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  // Pi SDK global object
  const Pi = typeof window !== "undefined" ? (window as any).Pi : null;

  const handleSignIn = async () => {
    if (!Pi) {
      alert("Pi SDK not detected. Open the app inside Pi Browser.");
      return;
    }

    setLoading(true);
    setPaymentStatus("");

    try {
      console.log("Requesting Pi authentication…");

      const scopes = ["payments"];
      const auth = await Pi.authenticate(scopes);

      console.log("Pi user authenticated:", auth);

      setPaymentStatus("Authentication successful.");
    } catch (err: any) {
      console.error("Sign-in failed:", err);
      setPaymentStatus("Sign-in failed.");
    }

    setLoading(false);
  };

  const handlePayment = async () => {
    if (!Pi) {
      alert("Pi SDK not detected. Open the app inside Pi Browser.");
      return;
    }

    setLoading(true);
    setPaymentStatus("");

    try {
      // 1) Tell backend to create a new payment
      const { paymentId, amount } = await createPayment();

      console.log("Backend created payment:", paymentId);

      // 2) Start Pi payment flow
      const payment = await Pi.createPayment({
        amount,
        memo: "SafePi Purchase",
        metadata: { paymentId },
      });

      console.log("Payment submitted:", payment);

      // 3) When blockchain confirms & Pi calls us back:
      Pi.on("completed", async (payment: any) => {
        console.log("Payment completed callback:", payment);

        await completePayment(payment.identifier);
        setPaymentStatus("Payment completed successfully!");
      });

      Pi.on("error", (err: any) => {
        console.error("Pi payment error:", err);
        setPaymentStatus("Payment failed.");
      });

      setPaymentStatus("Waiting for Pi Network confirmation...");
    } catch (err: any) {
      console.error("Payment error:", err);
      setPaymentStatus("Payment failed.");
    }

    setLoading(false);
  };

  return (
    <main className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">SafePi Shop</h1>

      <button
        onClick={handleSignIn}
        disabled={loading}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md mb-4"
      >
        {loading ? "Processing…" : "Sign in with Pi"}
      </button>

      <br />

      <button
        onClick={handlePayment}
        disabled={loading}
        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md"
      >
        {loading ? "Processing…" : "Buy with Pi"}
      </button>

      <p className="mt-6 text-lg">{paymentStatus}</p>
    </main>
  );
}
